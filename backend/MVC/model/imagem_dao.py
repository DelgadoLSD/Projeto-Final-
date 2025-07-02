# MVC/model/imagem_dao.py

import mysql.connector
from mysql.connector import Error

class ImagemDAO:
    def __init__(self, password: str = 'senha123'):
        # Apenas guarda as configurações
        self._db_config = {
            'host': 'localhost', 'user': 'agrineural',
            'password': password, 'database': 'agrineural'
        }

    def _get_connection(self):
        # Cada método cria sua própria conexão
        return mysql.connector.connect(**self._db_config)

    def salvar_imagem_e_resultado(self, fazenda_id, nome_arquivo, latitude, longitude, anomala):
        conn = self._get_connection()
        nova_imagem_id = None
        try:
            cursor = conn.cursor()
            conn.start_transaction()
            
            query_imagem = "INSERT INTO imagens (fazenda_id, nome, latitude, longitude) VALUES (%s, %s, %s, %s)"
            cursor.execute(query_imagem, (fazenda_id, nome_arquivo, latitude, longitude))
            nova_imagem_id = cursor.lastrowid

            query_resultado = "INSERT INTO resultados (id, anomala) VALUES (%s, %s)"
            cursor.execute(query_resultado, (nova_imagem_id, anomala))
            
            conn.commit()
            return nova_imagem_id
        except Error as e:
            conn.rollback()
            print(f"Erro na transação (ImagemDAO): {e}")
            return None
        finally:
            if conn.is_connected():
                cursor.close()
                conn.close()