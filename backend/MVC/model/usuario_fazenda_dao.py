import mysql.connector
from mysql.connector import IntegrityError

class UsuarioFazendaDAO:
    def __init__(self,
                 host='localhost',
                 user='agrineural',
                 password='senha123',
                 database='agrineural'):
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database
        )
        self.cursor = self.conn.cursor(dictionary=True)

    def buscar_fazendas_por_ccir(self, ccir: str) -> list:
        """
        Retorna a fazenda que tem o CCIR passado.
        """
        sql = """
            SELECT id,
                   ccir AS ccm,
                   nome,
                   latitude,
                   longitude,
                   ext_territorial AS area
              FROM fazendas
             WHERE ccir = %s
        """
        self.cursor.execute(sql, (ccir,))
        return self.cursor.fetchall()

    def associar_fazenda(self, cpf_usuario: str, fazenda_id: int):
        """
        Insere na tabela usuarios_fazendas: (cpf_usuario, fazenda_id).
        Lança IntegrityError se já existir associação.
        """
        sql = """
            INSERT INTO usuarios_fazendas (cpf_usuario, fazenda_id)
            VALUES (%s, %s)
        """
        try:
            self.cursor.execute(sql, (cpf_usuario, fazenda_id))
            self.conn.commit()
        except IntegrityError:
            raise

    def buscar_fazendas_do_usuario(self, cpf_usuario: str) -> list:
        sql = """
            SELECT f.id, f.ccir AS ccm, f.nome, f.latitude, f.longitude, f.ext_territorial AS area
            FROM fazendas f
            JOIN usuarios_fazendas uf ON uf.fazenda_id = f.id
            WHERE uf.cpf_usuario = %s
        """
        self.cursor.execute(sql, (cpf_usuario,))
        return self.cursor.fetchall()
