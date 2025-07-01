# MVC/controllers/produtor_controller.py

from flask import Blueprint, session, request, jsonify
from mysql.connector import IntegrityError
from MVC.model.fazenda_dao import FazendaDAO

produtor_bp = Blueprint('produtor', __name__)
fazenda_dao = FazendaDAO(password='senha123')

@produtor_bp.route('/area-produtor', methods=['GET'])
def area_produtor():
    if 'cpf' not in session:
        return jsonify({'status': 'error', 'message': 'Usuário não autenticado.'}), 401
    return jsonify({'status': 'success', 'message': 'Acesso autorizado à área do produtor.'})

@produtor_bp.route('/area-produtor/fazendas', methods=['POST'])
def criar_fazenda():
    # 1) Verifica autenticação
    if 'cpf' not in session:
        return jsonify({'status': 'error', 'message': 'Usuário não autenticado.'}), 401

    data = request.get_json()
    cpf_produtor = session['cpf']
    ccir         = data.get('ccm') or data.get('ccir')
    nome         = data.get('name') or data.get('nome')
    latitude     = data.get('latitude')
    longitude    = data.get('longitude')
    area         = data.get('area')

    # 2) Validação
    if not all([ccir, nome, latitude, longitude, area]):
        return jsonify({'status': 'error', 'message': 'Todos os campos são obrigatórios.'}), 400

    try:
        new_id = fazenda_dao.criar_fazenda(
            cpf_produtor=cpf_produtor,
            ccir=ccir,
            nome=nome,
            latitude=float(latitude),
            longitude=float(longitude),
            ext_territorial=float(area)
        )
        return jsonify({'status': 'success', 'id': new_id}), 201

    except IntegrityError:
        return jsonify({'status': 'error', 'message': 'CCIR já cadastrado.'}), 409
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Erro ao criar fazenda: {e}'}), 500

@produtor_bp.route('/area-produtor/fazendas', methods=['GET'])
def listar_fazendas():
    if 'cpf' not in session:
        return jsonify({'status': 'error', 'message': 'Usuário não autenticado.'}), 401

    cpf_produtor = session['cpf']
    try:
        sql = """
            SELECT id, ccir, nome, latitude, longitude, ext_territorial
            FROM fazendas
            WHERE cpf_produtor = %s
        """
        fazenda_dao.cursor.execute(sql, (cpf_produtor,))
        resultados = fazenda_dao.cursor.fetchall() 

        fazendas = []
        for row in resultados:
            fazendas.append({
                'id': str(row['id']),
                'ccm': row['ccir'],
                'name': row['nome'],
                'latitude': str(row['latitude']),
                'longitude': str(row['longitude']),
                'area': float(row['ext_territorial']),
            })

        return jsonify({'status': 'success', 'fazendas': fazendas}), 200

    except Exception as e:
        print(f"Erro detalhado ao listar fazendas para produtor {cpf_produtor}: {e}") 
        return jsonify({'status': 'error', 'message': f'Erro ao listar fazendas: {e}'}), 500

# ROTA ESPECÍFICA DO PRODUTOR PARA MAPA DE CALOR (PROBLEMÁTICA, pois o frontend do produtor não usava essa rota antes)
@produtor_bp.route('/area-produtor/mapa-calor/<int:farm_id>', methods=['GET'])
def get_mapa_calor_data_produtor(farm_id):
    if 'cpf' not in session:
        return jsonify({'status': 'error', 'message': 'Usuário não autenticado.'}), 401

    cpf_produtor = session['cpf']

    # BUSCA A FAZENDA E VERIFICA SE PERTENCE AO PRODUTOR LOGADO
    fazenda_data = fazenda_dao.buscar_fazenda_por_id(farm_id)

    if not fazenda_data:
        return jsonify({'status': 'error', 'message': 'Fazenda não encontrada.'}), 404
    
    # VERIFICAÇÃO CHAVE: Confere se o cpf_produtor da fazenda é o mesmo do usuário logado
    if fazenda_data['cpf_produtor'] != cpf_produtor:
        return jsonify({'status': 'error', 'message': 'Acesso negado: Esta fazenda não pertence ao seu usuário.'}), 403 # 403 Forbidden

    # Busca dados das imagens e resultados (mesmo método usado pelo mosaiqueiro)
    imagens_data = fazenda_dao.buscar_imagens_e_resultados_por_fazenda(farm_id)

    response_fazenda = {
        'id': str(fazenda_data['id']),
        'name': fazenda_data['nome'],
        'ccm': fazenda_data['ccir'],
        'latitude': str(fazenda_data['latitude']),
        'longitude': str(fazenda_data['longitude']),
        'area': float(fazenda_data['ext_territorial']),
        'producerName': fazenda_data['producerName'], 
        'producerCpf': fazenda_data['producerCpf']
    }

    processed_imagens_data = [
        {**img, 'anomala': bool(img['anomala'])} for img in imagens_data
    ]

    return jsonify({
        'status': 'success',
        'farm': response_fazenda,
        'images': processed_imagens_data
    })