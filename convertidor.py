import csv
import json

def procesar_uniruta():
    lista_final = []
    try:
        with open('rutas_atu.csv', mode='r', encoding='latin-1') as f:
            lector = csv.DictReader(f)
            for fila in lector:
                fila = {k.strip(): v for k, v in fila.items() if k is not None}
                
                # Geometría
                geo_texto = fila.get('geometria', '').strip()
                coordenadas = [[float(p.split(',')[0]), float(p.split(',')[1])] for p in geo_texto.split(';') if ',' in p]
                
                # Paraderos
                paraderos_texto = fila.get('paraderos', '').strip()
                lista_paraderos = []
                if paraderos_texto:
                    for item in paraderos_texto.split(';'):
                        partes = item.split(',')
                        if len(partes) == 3:
                            lista_paraderos.append({
                                "nombre": partes[0].strip(),
                                "coord": [float(partes[1]), float(partes[2])]
                            })

                lista_final.append({
                    "id": fila.get('N°', '0'),
                    "codigo": fila.get('Ruta', 'S/N'),
                    "empresa": fila.get('Operador', 'Desconocido'),
                    "destino": f"{fila.get('Distrito Inicial', '')} ↔ {fila.get('Distrito Final', '')}",
                    "color": "#3b82f6",
                    "puntos": coordenadas if coordenadas else [[-12.046, -77.042]],
                    "paraderos": lista_paraderos
                })
        
        with open('datos_rutas.json', 'w', encoding='utf-8') as f_json:
            json.dump(lista_final, f_json, indent=4, ensure_ascii=False)
            
        print(f"✅ [UniRuta] Base de datos actualizada con éxito.")
        
    except Exception as e:
        print(f"❌ [UniRuta] Error en conversión: {e}")

if __name__ == "__main__":
    procesar_uniruta()