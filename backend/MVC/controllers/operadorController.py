# MVC/controllers/operadorController.py

# Importações existentes
from flask import Blueprint, session, request, jsonify
from mysql.connector import IntegrityError
from MVC.model.usuario_fazenda_dao import UsuarioFazendaDAO
from MVC.model.fazenda_dao import FazendaDAO

# --- NOVAS IMPORTAÇÕES ---
import os
from werkzeug.utils import secure_filename
from MVC.model.imagem_dao import ImagemDAO # Nosso novo DAO
from MVC.services.IAService import ModeloAgrineural # Seu modelo de IA

# --- CONFIGURAÇÃO ---
operador_bp = Blueprint('operador', __name__)
uf_dao = UsuarioFazendaDAO(password='senha123')
fazenda_dao = FazendaDAO(password='senha123')
imagem_dao = ImagemDAO(password='senha123') # Instancia o novo DAO

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# --- SUAS ROTAS EXISTENTES (sem alteração) ---
@operador_bp.route('/area-operador/fazendas', methods=['GET'])
def listar_fazendas_por_ccir():
    if 'cpf' not in session:
        return jsonify({'status':'error','message':'Usuário não autenticado.'}), 401
    ccir = request.args.get('ccir')
    if not ccir:
        return jsonify({'status':'error','message':'ccir é obrigatório.'}), 400
    fazendas = uf_dao.buscar_fazendas_por_ccir(ccir)
    return jsonify({'status':'success','fazendas':fazendas})

@operador_bp.route('/area-operador/fazendas', methods=['POST'])
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
    
@operador_bp.route('/area-operador/fazendas/associadas', methods=['GET'])
def fazendas_associadas():
    if 'cpf' not in session:
        return jsonify({'status':'error','message':'Usuário não autenticado'}), 401
    fazendas = uf_dao.buscar_fazendas_do_usuario(session['cpf'])
    return jsonify({'status':'success','fazendas':fazendas})


# --- NOVO ENDPOINT DE UPLOAD DE IMAGEM ---
@operador_bp.route('/area-operador/upload/imagem', methods=['POST'])
def upload_imagem():
    # 1. Validação de segurança e sessão
    if 'cpf' not in session:
        return jsonify({'status': 'error', 'message': 'Usuário não autenticado.'}), 401
    
    # Validação do formulário
    if 'imagem' not in request.files:
        return jsonify({'status': 'error', 'message': 'Nenhum arquivo de imagem enviado.'}), 400
        
    file = request.files['imagem']
    if file.filename == '':
        return jsonify({'status': 'error', 'message': 'Nome de arquivo vazio.'}), 400

    # Pega os dados enviados junto com o arquivo
    fazenda_id = request.form.get('fazenda_id')
    latitude = request.form.get('latitude')
    longitude = request.form.get('longitude')

    if not all([fazenda_id, latitude, longitude]):
        return jsonify({'status': 'error', 'message': 'Dados incompletos (fazenda_id, latitude ou longitude faltando).'}), 400

    try:
        # 2. Salvar o arquivo fisicamente
        filename = secure_filename(file.filename)
        caminho_arquivo = os.path.join(UPLOAD_FOLDER, filename)
        file.save(caminho_arquivo)
        print(f"Arquivo salvo em: {caminho_arquivo}")

        # 3. Chamar o modelo de IA
        # A classe IAService deve ser capaz de ser instanciada e usada
        modelo = ModeloAgrineural()
        resultado_analise = modelo.analisarImagem(caminhoArquivo=caminho_arquivo) # Ex: "Anômala" ou "Saudável"
        anomala = (resultado_analise == "Anômala")
        print(f"Resultado da IA para '{filename}': {resultado_analise} (Anômala: {anomala})")

        # 4. Usar o novo DAO para salvar tudo no banco de dados
        imagem_id = imagem_dao.salvar_imagem_e_resultado(
            fazenda_id=int(fazenda_id),
            nome_arquivo=filename,
            latitude=float(latitude),
            longitude=float(longitude),
            anomala=anomala
        )

        if imagem_id is None:
            # Se o DAO retornou None, algo deu errado na transação
            raise Exception("Falha ao salvar os dados da imagem no banco de dados.")

        # 5. Retornar sucesso para o frontend
        return jsonify({
            'status': 'success',
            'message': 'Imagem processada e salva com sucesso!',
            'data': {'imagemId': imagem_id, 'resultado': anomala}
        }), 201

    except Exception as e:
        # Em caso de qualquer erro, loga e retorna uma mensagem de erro genérica
        print(f"[ERRO NO UPLOAD] - {e}")
        # Opcional: tentar apagar o arquivo salvo se o processo falhou
        if 'caminho_arquivo' in locals() and os.path.exists(caminho_arquivo):
            os.remove(caminho_arquivo)
        return jsonify({'status': 'error', 'message': 'Ocorreu um erro interno no servidor.'}), 500