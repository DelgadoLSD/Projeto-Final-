# MVC/model/fazenda_dao.py

import mysql.connector

class FazendaDAO:
    def __init__(self,
                 host: str = 'localhost',
                 user: str = 'agrineural',
                 password: str = 'senha123',
                 database: str = 'agrineural'):
        try:
            self.conn = mysql.connector.connect(
                host=host,
                user=user,
                password=password,
                database=database
            )
            self.cursor = self.conn.cursor()
            print("[INFO] Conexão com o banco de dados estabelecida (FazendaDAO).")
        except mysql.connector.Error as err:
            print(f"[ERRO] Falha na conexão (FazendaDAO): {err}")
            raise

    def criar_fazenda(self,
                      cpf_produtor: str,
                      ccir: str,
                      nome: str,
                      latitude: float,
                      longitude: float,
                      ext_territorial: float) -> int:
        """
        Insere uma nova fazenda na tabela 'fazendas' e retorna o id gerado.
        Lança IntegrityError se ccir duplicado.
        """
        sql = """
            INSERT INTO fazendas
              (cpf_produtor, ccir, nome, latitude, longitude, ext_territorial)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        self.cursor.execute(sql, (cpf_produtor, ccir, nome,
                                  latitude, longitude, ext_territorial))
        self.conn.commit()
        return self.cursor.lastrowid
