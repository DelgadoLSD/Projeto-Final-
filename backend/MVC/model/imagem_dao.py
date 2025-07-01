# MVC/model/imagem_dao.py

import mysql.connector
from mysql.connector import Error

class ImagemDAO:
    def __init__(self, password):
        # A configuração de conexão deve ser centralizada, mas por enquanto,
        # vamos replicar o padrão dos seus outros DAOs.
        self._db_config = {
            'host': 'localhost',
            'user': 'agrineural',
            'password': password,
            'database': 'agrineural'
        }

    def _get_connection(self):
        return mysql.connector.connect(**self._db_config)

    def salvar_imagem_e_resultado(self, fazenda_id, nome_arquivo, latitude, longitude, anomala):
        """
        Salva uma nova imagem e seu resultado de análise em uma única transação.
        Retorna o ID da nova imagem ou None em caso de erro.
        """
        nova_imagem_id = None
        connection = self._get_connection()
        cursor = connection.cursor()

        try:
            # Inicia a transação para garantir que ambas as inserções ocorram com sucesso
            connection.start_transaction()

            # 1. Insere na tabela 'imagens'
            query_imagem = """
                INSERT INTO imagens (fazenda_id, nome, latitude, longitude)
                VALUES (%s, %s, %s, %s)
            """
            imagem_data = (fazenda_id, nome_arquivo, latitude, longitude)
            cursor.execute(query_imagem, imagem_data)
            
            # Pega o ID da imagem que acabamos de inserir
            nova_imagem_id = cursor.lastrowid

            # 2. Insere na tabela 'resultados' usando o ID da imagem
            query_resultado = "INSERT INTO resultados (id, anomala) VALUES (%s, %s)"
            resultado_data = (nova_imagem_id, anomala)
            cursor.execute(query_resultado, resultado_data)

            # Se tudo deu certo, confirma a transação
            connection.commit()
            print(f"Sucesso: Imagem ID {nova_imagem_id} e resultado salvos no banco.")

        except Error as e:
            # Se algo deu errado, desfaz a transação
            print(f"Erro na transação com o banco de dados: {e}")
            connection.rollback()
            nova_imagem_id = None # Retorna None para indicar o erro
        
        finally:
            # Fecha o cursor e a conexão
            cursor.close()
            connection.close()
            
        return nova_imagem_id