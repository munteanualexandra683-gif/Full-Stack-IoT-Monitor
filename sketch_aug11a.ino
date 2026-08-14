#include <Wire.h>
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "...";
const char* password = "...";  

const char* serverName = "http://192.168.25.100:5000/api/date";


const int pinSenzorVoltaj = 34;
const int ledRosu = 12;
const int ledGalben = 13;
const int ledVerde = 14;
const int buzzer = 5;

const byte TH06_ADDR = 0x40; 


float citesteTemperaturaTH06() {
  Wire.beginTransmission(TH06_ADDR);
  Wire.write(0xF3);
  if (Wire.endTransmission() != 0) return -999.0;

  delay(100);

  Wire.requestFrom(TH06_ADDR, (byte)2);
  if (Wire.available() < 2) return -999.0;

  unsigned int msb = Wire.read();
  unsigned int lsb = Wire.read();
  unsigned int rawTemp = (msb << 8) | lsb;
  
  rawTemp &= 0xFFFC;
  return (175.72 * rawTemp / 65536.0) - 46.85;
}


void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);

  pinMode(ledRosu, OUTPUT);
  pinMode(ledGalben, OUTPUT);
  pinMode(ledVerde, OUTPUT);
  pinMode(buzzer, OUTPUT);


  Serial.print("Connecting to Wi-Fi...");
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nWi-Fi Connected!");
  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());
}


void loop() {

  long sumaBruta = 0;
  for (int i = 0; i < 10; i++) {
    sumaBruta += analogRead(pinSenzorVoltaj);
    delay(5);
  }
  float valoareBruta = sumaBruta / 10.0;
  float voltajPePin = (valoareBruta / 4095.0) * 3.3;
  float tensiuneReala = voltajPePin * 11.0;


  float temperatura = citesteTemperaturaTH06();


  digitalWrite(ledRosu, LOW);
  digitalWrite(ledGalben, LOW);
  digitalWrite(ledVerde, LOW);
  digitalWrite(buzzer, LOW);

  if (tensiuneReala < 20.0) {
    digitalWrite(ledRosu, HIGH);
    digitalWrite(buzzer, HIGH);
  } else if (tensiuneReala >= 20.0 && tensiuneReala < 22.0) {
    digitalWrite(ledGalben, HIGH);
  } else {
    digitalWrite(ledVerde, HIGH);
  }

  if (WiFi.status() == WL_CONNECTED && temperatura != -999.0) {
    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");


    String httpRequestData = "{\"tensiune\":" + String(tensiuneReala, 2) + ", \"temperatura\":" + String(temperatura, 2) + "}";


    int httpResponseCode = http.POST(httpRequestData);

    if (httpResponseCode > 0) {
      Serial.print("Data Sent to Server. Response Code: ");
      Serial.println(httpResponseCode); 
    } else {
      Serial.print("Error sending data. Code: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  } else {
    Serial.println("Wi-Fi Disconnected or TH06 Error!");
  }


  delay(2000);
}
