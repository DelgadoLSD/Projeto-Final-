# MVC/controllers/operadorController.py

from flask import Blueprint, session, request, jsonify
from mysql.connector import IntegrityError
from MVC.model.usuario_fazenda_dao import UsuarioFazendaDAO
from MVC.model.fazenda_dao import FazendaDAO
from MVC.model.imagem_dao import ImagemDAO
from MVC.services.IAService import ModeloAgrineural
import os
from werkzeug.utils import secure_filename

operador_bp = Blueprint('operador', __name__)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- NÃO INSTANCIAMOS MAIS OS DAOs AQUI ---

@operador_bp.route('/fazendas', methods=['GET'])
def listar_fazendas_por_ccir():
    if 'cpf' not in session: return jsonify({'status':'error','message':'Usuário não autenticado.'}), 401
    
    # Instancia o DAO apenas quando necessário
    uf_dao = UsuarioFazendaDAO(password='senha123')
    
    ccir = request.args.get('ccir')
    if not ccir: return jsonify({'status':'error','message':'ccir é obrigatório.'}), 400
    
    fazendas = uf_dao.buscar_fazendas_por_ccir(ccir)
    return jsonify({'status':'success','fazendas':fazendas})

@operador_bp.route('/fazendas', methods=['POST'])
def associar_fazenda():
    if 'cpf' not in session: return jsonify({'status':'error','message':'Usuário não autenticado.'}), 401
    
    # Instancia o DAO apenas quando necessário
    uf_dao = UsuarioFazendaDAO(password='senha123')

    data = request.get_json()
    farm_id = data.get('farm_id')
    if not farm_id: return jsonify({'status':'error','message':'farm_id é obrigatório.'}), 400
    
    try:
        uf_dao.associar_fazenda(session['cpf'], int(farm_id))
        return jsonify({'status':'success'}), 201
    except IntegrityError:
        return jsonify({'status':'error','message':'Já associado a essa fazenda.'}), 409
    except Exception as e:
        return jsonify({'status':'error','message':f'Erro ao associar fazenda: {e}'}), 500
    
@operador_bp.route('/fazendas/associadas', methods=['GET'])
def fazendas_associadas():
    if 'cpf' not in session: return jsonify({'status':'error','message':'Usuário não autenticado'}), 401
    
    # Instancia o DAO apenas quando necessário
    uf_dao = UsuarioFazendaDAO(password='senha123')

    fazendas = uf_dao.buscar_fazendas_do_usuario(session['cpf'])
    return jsonify({'status':'success','fazendas':fazendas})

@operador_bp.route('/upload/imagem', methods=['POST'])
def upload_imagem():
    if 'cpf' not in session: return jsonify({'status': 'error', 'message': 'Usuário não autenticado.'}), 401
    if 'imagem' not in request.files: return jsonify({'status': 'error', 'message': 'Nenhum arquivo de imagem enviado.'}), 400
    
    file = request.files['imagem']
    if file.filename == '': return jsonify({'status': 'error', 'message': 'Nome de arquivo vazio.'}), 400

    fazenda_id = request.form.get('fazenda_id')
    latitude = request.form.get('latitude')
    longitude = request.form.get('longitude')
    if not all([fazenda_id, latitude, longitude]): return jsonify({'status': 'error', 'message': 'Dados incompletos.'}), 400

    try:
        filename = secure_filename(file.filename)
        caminho_arquivo = os.path.join(UPLOAD_FOLDER, filename)
        file.save(caminho_arquivo)

        modelo = ModeloAgrineural()
        resultado_analise = modelo.analisarImagem(caminhoArquivo=caminho_arquivo)
        anomala = (resultado_analise == "Anômala")

        # Instancia o DAO de imagem apenas aqui
        imagem_dao = ImagemDAO(password='senha123')
        
        imagem_id = imagem_dao.salvar_imagem_e_resultado(
            fazenda_id=int(fazenda_id), nome_arquivo=filename,
            latitude=float(latitude), longitude=float(longitude), anomala=anomala
        )

        if imagem_id is None: raise Exception("Falha ao salvar dados no banco.")

        return jsonify({'status': 'success', 'message': 'Imagem processada!', 'data': {'imagemId': imagem_id}}), 201
    except Exception as e:
        print(f"[ERRO NO UPLOAD] - {e}")
        if 'caminho_arquivo' in locals() and os.path.exists(caminho_arquivo): os.remove(caminho_arquivo)
        return jsonify({'status': 'error', 'message': 'Erro interno no servidor.'}), 500