from flask import Blueprint, session, request, jsonify
from mysql.connector import IntegrityError
from MVC.model.usuario_fazenda_dao import UsuarioFazendaDAO
from MVC.model.fazenda_dao import FazendaDAO # Importar o FazendaDAO

mosaiqueiro_bp = Blueprint('mosaiqueiro', __name__)
uf_dao = UsuarioFazendaDAO(password='senha123')
fazenda_dao = FazendaDAO(password='senha123') # Instanciar o FazendaDAO

@mosaiqueiro_bp.route('/area-mosaiqueiro/fazendas', methods=['GET'])
def listar_fazendas_por_ccir():
    if 'cpf' not in session:
        return jsonify({'status':'error','message':'Usuário não autenticado.'}), 401

    ccir = request.args.get('ccir')
    if not ccir:
        return jsonify({'status':'error','message':'ccir é obrigatório.'}), 400

    fazendas = uf_dao.buscar_fazendas_por_ccir(ccir)
    return jsonify({'status':'success','fazendas':fazendas})

@mosaiqueiro_bp.route('/area-mosaiqueiro/fazendas', methods=['POST'])
def associar_fazenda():
    if 'cpf' not in session:
        return jsonify({'status':'error','message':'Usuário não autenticado.'}), 401

    data = request.get_json()
    farm_id = data.get('farm_id')
    if not farm_id:
        return jsonify({'status':'error','message':'farm_id é obrigatório.'}), 400

    try:
        uf_dao.associar_fazenda(session['cpf'], int(farm_id))
        return jsonify({'status':'success'}), 201
    except IntegrityError:
        return jsonify({'status':'error','message':'Já associado a essa fazenda.'}), 409
    except Exception as e:
        return jsonify({'status':'error','message':f'Erro ao associar fazenda: {e}'}), 500
    
@mosaiqueiro_bp.route('/area-mosaiqueiro/fazendas/associadas', methods=['GET'])
def fazendas_associadas():
    if 'cpf' not in session:
        return jsonify({'status':'error','message':'Usuário não autenticado'}), 401
    fazendas = uf_dao.buscar_fazendas_do_usuario(session['cpf'])
    return jsonify({'status':'success','fazendas':fazendas})

# ROTA ESPECÍFICA DO MOSAIQUEIRO PARA MAPA DE CALOR (FUNCIONAVA)
@mosaiqueiro_bp.route('/area-mosaiqueiro/mapa-calor/<int:farm_id>', methods=['GET'])
def get_mapa_calor_data(farm_id):
    if 'cpf' not in session:
        return jsonify({'status': 'error', 'message': 'Usuário não autenticado.'}), 401

    # Verificar se o mosaiqueiro tem acesso a esta fazenda (opcional, mas recomendado para segurança)
    fazendas_associadas_do_usuario = uf_dao.buscar_fazendas_do_usuario(session['cpf'])
    
    fazenda_ids_permitidos = {f['id'] for f in fazendas_associadas_do_usuario}

    if farm_id not in fazenda_ids_permitidos:
        return jsonify({'status': 'error', 'message': 'Acesso negado: Fazenda não encontrada ou não associada ao seu usuário.'}), 403 # 403 Forbidden

    # Buscar dados da fazenda
    fazenda_data = fazenda_dao.buscar_fazenda_por_id(farm_id)
    if not fazenda_data:
        return jsonify({'status': 'error', 'message': 'Fazenda não encontrada.'}), 404

    # Buscar dados das imagens e resultados
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