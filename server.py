from flask import Flask, render_template, jsonify, request
import sqlite3

app = Flask(__name__)


def init_db():
    conexiune = sqlite3.connect('senzori.db')
    cursor = conexiune.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS istoric (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            tensiune REAL,
            temperatura REAL
        )
    ''')
    conexiune.commit()
    conexiune.close()

init_db()


@app.route('/')
def dashboard():
    return render_template('index.html')


@app.route('/api/latest')
def get_latest_data():
    conexiune = sqlite3.connect('senzori.db')
    cursor = conexiune.cursor()
    
    comanda_sql = "SELECT * FROM istoric ORDER BY id DESC LIMIT 1"
    cursor.execute(comanda_sql)
    randul_gasit = cursor.fetchone()
    conexiune.close()
    
    if randul_gasit is None:
        return jsonify({"tensiune": 0, "temperatura": 0, "timestamp": "N/A"})
    
    date_formatate = {
        "timestamp": randul_gasit[1],
        "tensiune": randul_gasit[2],
        "temperatura": randul_gasit[3]
    }
    return jsonify(date_formatate)


@app.route('/api/history')
def get_history_data():
    conexiune = sqlite3.connect('senzori.db')
    cursor = conexiune.cursor()
    
    comanda_sql = "SELECT timestamp, tensiune, temperatura FROM istoric ORDER BY id DESC LIMIT 20"
    cursor.execute(comanda_sql)
    randuri = cursor.fetchall()
    conexiune.close()
    
    randuri.reverse()
    
    date_formatate = []
    for rand in randuri:
        date_formatate.append({
            "timestamp": rand[0],
            "tensiune": rand[1],
            "temperatura": rand[2]
        })
        
    return jsonify(date_formatate)


@app.route('/api/date', methods=['POST'])
def primeste_date():
    try:
        
        date_primite = request.get_json()
        
        tensiune = date_primite.get('tensiune')
        temperatura = date_primite.get('temperatura')
        
        
        conexiune = sqlite3.connect('senzori.db')
        cursor = conexiune.cursor()
        cursor.execute("INSERT INTO istoric (tensiune, temperatura) VALUES (?, ?)", (tensiune, temperatura))
        conexiune.commit()
        conexiune.close()
        
        
        print(f"Wi-Fi Data Received -> Voltage: {tensiune}V | Temp: {temperatura}°C")
        
        return jsonify({"mesaj": "Date salvate cu succes"}), 200
        
    except Exception as e:
        print(f"Error saving data: {e}")
        return jsonify({"eroare": str(e)}), 400


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)
