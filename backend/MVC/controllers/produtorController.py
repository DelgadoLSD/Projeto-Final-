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
