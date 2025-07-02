# MVC/controllers/produtorController.py

from flask import Blueprint, session, request, jsonify
from mysql.connector import IntegrityError
from MVC.model.fazenda_dao import FazendaDAO
from MVC.model.relatorio_dao import RelatorioDAO # Mantido caso você use em outra parte

produtor_bp = Blueprint('produtor', __name__)

# NÃO instanciamos mais os DAOs aqui para evitar erros de conexão na inicialização

@produtor_bp.route('/fazendas', methods=['POST'])
def criar_fazenda():
    if 'cpf' not in session: return jsonify({'status': 'error', 'message': 'Usuário não autenticado.'}), 401
    
    # Instancia o DAO apenas dentro da rota
    fazenda_dao = FazendaDAO(password='senha123')
    
    data = request.get_json()
    cpf_produtor = session['cpf']
    ccir = data.get('ccm') or data.get('ccir')
    nome = data.get('name') or data.get('nome')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    area = data.get('area')

    if not all([ccir, nome, latitude, longitude, area]):
        return jsonify({'status': 'error', 'message': 'Todos os campos são obrigatórios.'}), 400

    try:
        new_id = fazenda_dao.criar_fazenda(
            cpf_produtor=cpf_produtor, ccir=ccir, nome=nome,
            latitude=float(latitude), longitude=float(longitude), ext_territorial=float(area)
        )
        return jsonify({'status': 'success', 'id': new_id}), 201
    except IntegrityError:
        return jsonify({'status': 'error', 'message': 'CCIR já cadastrado.'}), 409
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Erro ao criar fazenda: {e}'}), 500

@produtor_bp.route('/fazendas', methods=['GET'])
def listar_fazendas():
    if 'cpf' not in session: return jsonify({'status': 'error', 'message': 'Usuário não autenticado.'}), 401
    
    # Instancia o DAO apenas dentro da rota
    fazenda_dao = FazendaDAO(password='senha123')
    
    cpf_produtor = session['cpf']
    try:
        # Chama o novo método que adicionamos ao DAO
        resultados = fazenda_dao.buscar_fazendas_por_produtor(cpf_produtor)

        # Formata os dados para o frontend (seu código original, que está correto)
        fazendas = [{
            'id': str(row['id']),
            'ccm': row['ccir'],
            'name': row['nome'],
            'latitude': str(row['latitude']),
            'longitude': str(row['longitude']),
            'area': float(row['ext_territorial']),
        } for row in resultados]

        return jsonify({'status': 'success', 'fazendas': fazendas}), 200
    except Exception as e:
        print(f"Erro detalhado ao listar fazendas para produtor {cpf_produtor}: {e}") 
        return jsonify({'status': 'error', 'message': 'Erro ao listar fazendas.'}), 500

@produtor_bp.route('/mapa-calor/<int:farm_id>', methods=['GET'])
def get_mapa_calor_data_produtor(farm_id):
    if 'cpf' not in session: return jsonify({'status': 'error', 'message': 'Usuário não autenticado.'}), 401
    
    # Instancia o DAO apenas dentro da rota
    fazenda_dao = FazendaDAO(password='senha123')
    
    cpf_produtor_logado = session['cpf']
    try:
        # Usa os métodos que já existiam no DAO do seu amigo
        detalhes_fazenda = fazenda_dao.buscar_fazenda_por_id(farm_id)
        if not detalhes_fazenda: return jsonify({'status': 'error', 'message': 'Fazenda não encontrada.'}), 404
        if detalhes_fazenda['cpf_produtor'] != cpf_produtor_logado: return jsonify({'status': 'error', 'message': 'Acesso negado.'}), 403

        imagens_data = fazenda_dao.buscar_imagens_e_resultados_por_fazenda(farm_id)
        
        # Formata a resposta exatamente como o frontend espera
        response_fazenda = {
            'id': str(detalhes_fazenda['id']),
            'name': detalhes_fazenda['nome'],
            'ccm': detalhes_fazenda['ccir'],
            'latitude': str(detalhes_fazenda['latitude']),
            'longitude': str(detalhes_fazenda['longitude']),
            'area': float(detalhes_fazenda['ext_territorial']),
            'producerName': detalhes_fazenda['producerName'], 
            'producerCpf': detalhes_fazenda['producerCpf']
        }
        processed_imagens_data = [{**img, 'anomala': bool(img['anomala'])} for img in imagens_data]

        return jsonify({
            'status': 'success',
            'farm': response_fazenda,
            'images': processed_imagens_data
        })
    except Exception as e:
        print(f"Erro inesperado na rota mapa-calor para farm_id {farm_id}: {e}")
        return jsonify({'status': 'error', 'message': 'Erro interno inesperado no servidor.'}), 500

# Rota de Relatório da Fazenda
@produtor_bp.route('/relatorio/<int:farm_id>', methods=['GET'])
def get_farm_report_data(farm_id):
    if 'cpf' not in session:
        return jsonify({'status': 'error', 'message': 'Usuário não autenticado.'}), 401
    
    # Instancia o DAO apenas dentro da rota
    fazenda_dao = FazendaDAO(password='senha123')
    relatorio_dao = RelatorioDAO(password='senha123')

    cpf_produtor = session['cpf']
    try:
        # 1. Buscar dados da fazenda
        farm_data = fazenda_dao.buscar_fazenda_por_id(farm_id)
        if not farm_data:
            return jsonify({"status": "error", "message": "Fazenda não encontrada"}), 404
        
        # Verificar se a fazenda pertence ao produtor logado
        if farm_data['cpf_produtor'] != cpf_produtor:
            return jsonify({'status': 'error', 'message': 'Acesso negado: Esta fazenda não pertence ao seu usuário.'}), 403

        # 2. Obter estatísticas de imagens (total, anômalas, normais)
        image_stats = relatorio_dao.get_farm_image_stats(farm_id)

        total_images = image_stats['total_images'] if image_stats and image_stats['total_images'] is not None else 0
        anomalous_images = image_stats['anomalous_images'] if image_stats and image_stats['anomalous_images'] is not None else 0
        normal_images = total_images - anomalous_images
        
        # Calcular status baseado nas anomalias
        status = 'healthy'
        if total_images > 0:
            anomaly_percentage_calc = (anomalous_images / total_images) * 100
            if anomaly_percentage_calc >= 70: # 70% ou mais = Crítico
                status = 'critical'
            elif anomaly_percentage_calc >= 30: # 30% a 69.9% = Atenção (warning)
                status = 'warning'
            # else: 0% a 29.9% = Saudável (healthy) - já é o default
        
        farm_response = {
            "id": str(farm_data['id']),
            "name": farm_data['nome'],
            "ccm": farm_data['ccir'],
            "latitude": str(farm_data['latitude']),
            "longitude": str(farm_data['longitude']),
            "area": float(farm_data['ext_territorial']),
            "status": status,
            # "lastInspection": "Não Disponível (sem data no DB)", # Removido, pois o frontend não mostrará mais
            "producerName": farm_data['producerName'], 
            "producerCpf": farm_data['producerCpf'],
            "totalImages": total_images,
            "anomalousImages": anomalous_images,
            "normalImages": normal_images
        }

        # Dados do relatório:
        # anomalyTypes: Calculado a partir das imagens (total de anômalas e normais)
        anomaly_types_data = [
            {"name": "Anômalas", "value": anomalous_images, "color": '#ef4444'},
            {"name": "Normais", "value": normal_images, "color": '#22c55e'}
        ]

        # weeklyAnalysis e monthlyTrend: VAZIOS, pois não há data no DB
        weekly_analysis_data = [] # Mantido para compatibilidade com a interface, mas vazio
        monthly_trend_data = [] # Mantido para compatibilidade com a interface, mas vazio

        # Recommendations: Removidas do backend, pois não serão mais usadas no frontend
        recommendations_data = [] 

        report_response_data = {
            "weeklyAnalysis": weekly_analysis_data,
            "anomalyTypes": anomaly_types_data,
            "monthlyTrend": monthly_trend_data,
            "recommendations": recommendations_data # Array vazio
        }

        return jsonify({
            "status": "success",
            "farm": farm_response,
            "reportData": report_response_data
        }), 200

    except Exception as e:
        print(f"Erro inesperado na rota de relatório para farm_id {farm_id}: {e}")
        return jsonify({'status': 'error', 'message': f'Erro interno do servidor: {e}'}), 500