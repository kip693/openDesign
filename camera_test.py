from datetime import datetime
import time
import RPi.GPIO as GPIO
import picamera

# インターバル
INTERVAL = 3
# スリープタイム
SLEEPTIME = 10
# 使用するGPIO
GPIO_PIN = 18

GPIO.setmode(GPIO.BCM)
GPIO.setup(GPIO_PIN, GPIO.IN)

if __name__ == '__main__':
    try:
        print ("処理キャンセル：CTRL+C")
        cnt = 1
        while True:
            # センサー感知
            if(GPIO.input(GPIO_PIN) == GPIO.HIGH):
                print(datetime.now().strftime('%Y/%m/%d %H:%M:%S') +
                "：本日" + str("{0:05d}".format(cnt)) + "回目のトイレ")
                cnt = cnt + 1
                time.sleep(SLEEPTIME)
                with picamera.PiCamera() as camera:
                 camera.resolution = (1024, 768)
                 camera.start_preview()
                 # Camera warm-up time
                 time.sleep(1)
                 camera.capture('my_picture.jpg')
            else:
                print(GPIO.input(GPIO_PIN))
                time.sleep(INTERVAL)
    except KeyboardInterrupt:
        print("終了処理中...")
    finally:
        GPIO.cleanup()
        print("GPIO clean完了")
