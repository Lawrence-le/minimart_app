# backend\app\db.py

import psycopg  # psycopg3 import
from flask import current_app

def get_db_connection():
    conn = psycopg.connect(current_app.config['DATABASE_URL'])
    return conn

def query_db(query, args=(), one=False):
    conn = get_db_connection()
    cursor = conn.cursor(row_factory=psycopg.rows.dict_row)
    cursor.execute(query, args)
    result = cursor.fetchall()
    conn.commit()
    cursor.close()
    conn.close()
    return (result[0] if result else None) if one else result


def execute_query(query, params=None, fetch=False):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(query, params)
    result = None
    if fetch:
        result = cursor.fetchone()
    conn.commit()
    cursor.close()
    conn.close()
    return result if fetch else None

# def execute_query(query, params=None, fetch=False, fetch_all=False):
#     conn = get_db_connection()
#     cursor = conn.cursor()
#     cursor.execute(query, params)
#     result = None
#     if fetch:
#         result = cursor.fetchone()
#     elif fetch_all:
#         result = cursor.fetchall()
#     conn.commit()
#     cursor.close()
#     conn.close()
#     return result
