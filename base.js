<script>
        //画像の表示
          var reader = new FileReader();
          reader.addEventListener('load', function(){
              $('.result').html('<img src="'+reader.result+'">');
          });
          $('.file_input').change(function(){
               if (this.files[0].type.match(/image/)){
                     reader.readAsDataURL(this.files[0]);
               }
          });
     //画像認識
          $(function(){
               $('#js--button_search').click(function(){
                  //jsonデータ？？azureの基本データ
                   $.ajax({
                          url: "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/2d80c229-0fb8-4257-83e9-cf39cd15c677/image?iterationId=78a3d81a-7558-485e-b4f3-76f4fbac8e40",
                          beforeSend: function(xhrObj){
                               // Request headers
                               xhrObj.setRequestHeader("Content-Type"," application/octet-stream");
                               xhrObj.setRequestHeader("Prediction-key","df1267f033ef44c9a275a143b72d144c");
                          },
                          type: "POST",
                          data: $("input[name='file']").prop("files")[0],
                          processData: false,
                          contentType: false,
                          dataType: "json",
                     })
           //通信がうまくいったとき
                    .done(function(data) {
                          //alert("success");
                          console.log(data)
                          let text = '';
                          let text_result = '';
                          for( let i=0; i<data.predictions.length; i++ ){
                               text = text + data.predictions[i].tagName + " --- " + parseFloat(data.predictions[i].probability) * 100 + " %";
                               text = text + "\n";
                               let azure_result_top = data.predictions[0].tagName
                               let azure_result_secondry = data.predictions[1].tagName
                              //パーセンテージが高い方を選ぶ
                               if (azure_result_top == "poop_strawberry"){
                                    text_result = text + "\n" + "異常便（腸重積の疑い）を検知しました";
                            photo_result = "http://web.sfc.keio.ac.jp/~s16024kw/wordpress/wp-content/uploads/2018/11/4b5177fb264695c27675c0a36d371672.png"
                                  }else{
                                    if (azure_result_top == "poop_white"){
                                              text_result = text + "\n" + "異常便（ロタウイルス感染・胆道閉鎖症の疑い）を検知しました";
                                      photo_result = "http://web.sfc.keio.ac.jp/~s16024kw/wordpress/wp-content/uploads/2018/11/4b5177fb264695c27675c0a36d371672.png"
                                             }else{
                                                       if (azure_result_top == "poop_yellow") {
                                                         text_result = text + "\n" + "正常便を検知しました";
                                                  photo_result = "http://web.sfc.keio.ac.jp/~s16024kw/wordpress/wp-content/uploads/2018/11/bbf00b47ec54602c60856ded820958d5.png"
                                                       }else {
                                                         if (azure_result_top == "poop_brownandred") {
                                                           text_result = text + "\n" + "異常便（赤痢・O157の疑い）を検知しました";
                                                    photo_result = "http://web.sfc.keio.ac.jp/~s16024kw/wordpress/wp-content/uploads/2018/11/4b5177fb264695c27675c0a36d371672.png"
                                                         }else{
                                                         text_result = text + "\n" + "正常便（便秘）を検知しました。";
                                                          photo_result = "http://web.sfc.keio.ac.jp/~s16024kw/wordpress/wp-content/uploads/2018/11/056df9d0b84b21320cf41750c9689a56.png"
                                                                 }
                                                                       }
                                                                     }
                                                                   }
                                                                 }
               //js--resultに結果を表示
                          $('#js--result').text(text_result)
           $('#js--result-photo').children('img').attr('src',photo_result)
                   })
           //通信がダメだった時
                   .fail(function() {
                         alert("error");
                   });
              });
        });
    </script>
