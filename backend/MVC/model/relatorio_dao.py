# MVC/model/relatorio_dao.py

import mysql.connector

class RelatorioDAO:
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
            print("[INFO] Conexão com o banco de dados estabelecida (RelatorioDAO).")
        except mysql.connector.Error as err:
            print(f"[ERRO] Falha na conexão (RelatorioDAO): {err}")
            raise

    def get_farm_image_stats(self, fazenda_id: int):
        """
        Calcula o total de imagens, imagens anômalas e imagens normais para uma fazenda.
        Retorna também a data da última imagem (se disponível, caso a coluna data_registro seja adicionada futuramente).
        """
        sql = """
            SELECT COUNT(i.id) AS total_images,
                   SUM(CASE WHEN r.anomala = TRUE THEN 1 ELSE 0 END) AS anomalous_images,
                   -- MAX(i.data_registro) AS last_inspection -- Removido, pois data_registro não existe no schema atual
                   NULL AS last_inspection -- Placeholder para indicar que a data não está disponível
            FROM imagens i
            JOIN resultados r ON i.id = r.id
            WHERE i.fazenda_id = %s
        """
        self.cursor.execute(sql, (fazenda_id,))
        return self.cursor.fetchone()

    # Métodos para weeklyAnalysis e monthlyTrend não serão implementados aqui
    # devido à ausência da coluna `data_registro` na tabela `imagens`.

    def fechar(self):
        """
        Encerra a conexão com o banco de dados.
        """
        if self.conn.is_connected():
            self.cursor.close()
            self.conn.close()
            print("[INFO] Conexão com o banco de dados encerrada (RelatorioDAO).")