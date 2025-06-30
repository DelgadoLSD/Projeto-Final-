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
