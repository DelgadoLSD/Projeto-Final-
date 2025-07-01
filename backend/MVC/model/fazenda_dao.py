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
            self.cursor = self.conn.cursor(dictionary=True) 
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
        sql = """
            INSERT INTO fazendas
              (cpf_produtor, ccir, nome, latitude, longitude, ext_territorial)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        self.cursor.execute(sql, (cpf_produtor, ccir, nome,
                                  latitude, longitude, ext_territorial))
        self.conn.commit()
        return self.cursor.lastrowid

    # MÉTODO CORRIGIDO
    def buscar_fazenda_por_id(self, fazenda_id: int):
        """
        Busca os detalhes de uma fazenda pelo ID, incluindo os dados do produtor.
        """
        # MODIFICAÇÃO: Adicionado f.cpf_produtor à query
        sql = """
            SELECT
                f.id, f.nome, f.ccir, f.latitude, f.longitude, f.ext_territorial,
                f.cpf_produtor, -- <<< CORREÇÃO ESTÁ AQUI
                u.nome AS producerName,
                u.cpf AS producerCpf
            FROM fazendas AS f
            JOIN usuarios AS u ON f.cpf_produtor = u.cpf
            WHERE f.id = %s
        """
        self.cursor.execute(sql, (fazenda_id,))
        return self.cursor.fetchone()

    def buscar_imagens_e_resultados_por_fazenda(self, fazenda_id: int):
        """
        Busca todas as imagens e seus resultados de anomalia para uma fazenda específica.
        """
        sql = """
            SELECT
                i.nome, i.latitude AS lat, i.longitude AS lng, r.anomala
            FROM imagens AS i
            JOIN resultados AS r ON i.id = r.id
            WHERE i.fazenda_id = %s
        """
        self.cursor.execute(sql, (fazenda_id,))
        return self.cursor.fetchall()