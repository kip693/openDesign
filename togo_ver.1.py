from datetime import datetime
import time
import RPi.GPIO as GPIO
import picamera
from slacker import Slacker


# インターバル
INTERVAL = 3
# スリープタイム
SLEEPTIME = 10
# 使用するGPIO
GPIO_PIN = 18

GPIO.setmode(GPIO.BCM)
GPIO.setup(GPIO_PIN, GPIO.IN)

#slackのtoken
token = "****"
slacker = Slacker(token)
# #toiletに送信
channel_name = "#"+"toilet"
# メッセージ内容
message = 'トイレしたよ！\nリンクを開いて確認してね\n http://web.sfc.wide.ad.jp/~kip/ORFproject/orf_test.html'


if __name__ == '__main__':
    try:
        print ("処理キャンセル：CTRL+C")
        cnt = 1
        while True:
            # センサー感知
            if(GPIO.input(GPIO_PIN) == GPIO.HIGH):
                print(datetime.now().strftime('%Y/%m/%d %H:%M:%S') +"：本日" + str("{0:05d}".format(cnt)) + "回目のトイレ")
                cnt = cnt + 1
                time.sleep(SLEEPTIME)
                with picamera.PiCamera() as camera:
                 camera.resolution = (1024, 768)
                 camera.start_preview()
                 # Camera warm-up time
                 time.sleep(1)
                 camera.capture('my_picture.jpg')
                 camera.capture('/home/pi/O-D-pets/image.jpg')
                 # camera.capture('/home/[ユーザー名]/[ディレクトリ名]/image.jpg')
                 # この場合はユーザー名(pi)のディレクトリ内にある「O-D-pets」というディレクトリ内に「image.jpg」の形式で保存される

                 slacker.chat.post_message(channel_name,message)
            else:
                print(GPIO.input(GPIO_PIN))
                time.sleep(INTERVAL)
    except KeyboardInterrupt:
        print("終了処理中...")
    finally:
        GPIO.cleanup()
        print("GPIO clean完了")
