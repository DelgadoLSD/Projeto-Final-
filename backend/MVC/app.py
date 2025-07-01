from flask import Flask, redirect, url_for, jsonify
from flask_cors import CORS
from MVC.controllers.authController import auth_bp
from MVC.controllers.produtorController import produtor_bp
from MVC.controllers.operadorController import operador_bp
from MVC.controllers.mosaiqueiroController import mosaiqueiro_bp
from MVC.controllers.uploadController import upload_bp
from MVC.controllers.statusController import status_bp

# Inicializa o framework
app = Flask(__name__,
            template_folder='./view/templates',
            static_folder='./view/static'
            )

# MODIFICAÇÃO: Configuração do CORS mais robusta e explícita
# Substitua "http://localhost:5173" pela URL exata do seu frontend se for diferente
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# Configurações da aplicação
app.secret_key = 'chave_secreta_qualquer'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['STATUS_FOLDER'] = 'status'

# MODIFICAÇÃO: Direcionamento centralizado com url_prefix
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(produtor_bp, url_prefix='/area-produtor')
app.register_blueprint(operador_bp, url_prefix='/area-operador')
app.register_blueprint(mosaiqueiro_bp, url_prefix='/area-mosaiqueiro')
app.register_blueprint(upload_bp)
app.register_blueprint(status_bp)

# Rota inicial
@app.route('/')
def index():
    return redirect('http://localhost:5173/')

if __name__ == '__main__':
    app.run(debug=True)