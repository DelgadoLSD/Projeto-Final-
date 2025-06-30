from flask import Blueprint, session, request, jsonify
from mysql.connector import IntegrityError
from MVC.model.usuario_fazenda_dao import UsuarioFazendaDAO

mosaiqueiro_bp = Blueprint('mosaiqueiro', __name__)
uf_dao = UsuarioFazendaDAO(password='senha123')

@mosaiqueiro_bp.route('/area-mosaiqueiro/fazendas', methods=['GET'])
def listar_fazendas_por_ccir():
    if 'cpf' not in session:
        return jsonify({'status':'error','message':'Usuário não autenticado.'}), 401

    ccir = request.args.get('ccir')
    if not ccir:
        return jsonify({'status':'error','message':'ccir é obrigatório.'}), 400

    fazendas = uf_dao.buscar_fazendas_por_ccir(ccir)
    # retorna lista (normalmente conteúdo único) de { id, ccm, nome, latitude, longitude, area }
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
