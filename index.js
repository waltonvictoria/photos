var favoritos = [];
      
            const db = new Dexie("comentarios");
      
            db.version(1).stores({
              comments: 'idcomentario,comentario'
            });
      
      
            fetch('https://jsonplaceholder.typicode.com/photos')
            .then(response => response.json())
            .then(
                (json)=>{ 
      
                    coleccion = json;
                    if(localStorage.getItem("favoritoslocal")){
                          let f = localStorage.getItem("favoritoslocal");
                          favoritos = JSON.parse(f);
                          let acumulafav = "";
                        for(i in favoritos){
                          let index = coleccion.findIndex(elemento => elemento.id==favoritos[i]);                  
                          acumulafav +=  "<li><img src="+coleccion[index].thumbnailUrl+" width='50'><input type='button' value='Eliminar' onclick='eliminafav("+i+")'></li>"
                        }
                        $("#navfav ul").html(acumulafav);          
                        }
      
                      let acumula = "";                
                  for(i in json){
                          let index = favoritos.findIndex(favorito => favorito== json[i].id);                  
                          if(index != -1){
                            var activo_o_red = 'red';
                          }
                          else {
                            var activo_o_red = 'activo';
                          }
                          $("#contenedor").append(`<figure id="item${json[i].id}"><img src="${json[i].thumbnailUrl}" data-img="${json[i].url}" /><figcaption class="cap">${json[i].title}</figcaption><span><i class="fas fa-heart ${activo_o_red}" data-t="${json[i].id}"></i></span><figure>`);                  
                          let id = parseInt(json[i].id);                  
                          db.comments.where({ idcomentario: id}).first(item => {                    	
                              if(!item){                    		
                      $("#item"+id+">span").append(`<i class="fas fa-comments sinf" data-id="${id}"></i></span ></figure>`);
                              }
                              else{
                                $("#item"+id+">span").append(`<i class="fas fa-comments" data-id="${id}" style="color:blue"></i></span ></figure>`);
                                $("#item"+id+">span").append("<form id='com'><strong>Comentario</strong><br>"+item.comentario+"</form>"); 
                              }
                          }).catch(error => {
                            console.error(error.stack || error);
                          })                                   
                          if(i==9){
                              break;
                          } 			
                        }              
                      
                                          
                    }
                  ).then(()=>{ 
                    document.getElementById("espera").remove();
                    }
                  )
      
      
                  function filtrarImg(){
                        let acumula = "";
                        var elegido = $("#elegiralbum").val();
                        $("#contenedor").html("");
                        if(elegido == "0"){
                          var elegido = 1;
                        }
                  for(i in coleccion){            
                    if(coleccion[i].albumId == elegido){  
                              let index = favoritos.findIndex(favorito => favorito== coleccion[i].id);		                  
                              if(index != -1){
                                var activo_o_red = 'red';
                              }
                              else {
                                var activo_o_red = 'activo';
                              }
                            $("#contenedor").append(`<figure id="item${coleccion[i].id}"><img src="${coleccion[i].thumbnailUrl}" data-img="${coleccion[i].url}" /><figcaption class="cap">${coleccion[i].title}</figcaption><span><i class="fas fa-heart ${activo_o_red}" data-t="${coleccion[i].id}"></i></span><figure>`);                  
                            let id = parseInt(coleccion[i].id);                  
                            db.comments.where({ idcomentario: id}).first(item => {                    	
                                if(!item){                    			                    		
                        $("#item"+id+">span").append(`<i class="fas fa-comments sinf" data-id="${id}"></i></span ></figure>`);
                                }
                                else{
                                  $("#item"+id+">span").append(`<i class="fas fa-comments" data-id="${id}" style="color:blue"></i></span ></figure>`);
                                  $("#item"+id+">span").append("<form id='com'><strong>Comentario</strong><br>"+item.comentario+"</form>"); 
                                }
                            }).catch(error => {
                              console.error(error.stack || error);
                            })   
                              }
                      }
                      
                  }
      
      
                  
      
                  document.getElementById("contenedor").addEventListener("click",(ev)=>{
                          let imagen = ev.target.getAttribute("data-img");                                          
                          if(imagen !== null){
                            document.querySelector("#imggrande img").setAttribute("src",imagen);
                            document.querySelector("#imggrande").style.display="flex";              
                      }
                      
                  });
      
                  document.getElementById("imggrande").addEventListener("click",(ev)=>{
                    
                    if(ev.target == ev.currentTarget) {
                        document.querySelector("#imggrande").style.display="none"; 
                      }                           
      
              });     
      
      
              $(document).on('click', '.fa-heart.activo', function(event) {
                event.preventDefault();
                $(this).addClass("red"); 
                $(this).removeClass("activo"); 
                var tfav = $(this).attr("data-t");
                favoritos.push(tfav);
                listarfav();
              });
      
              $(document).on('click', '.fa-comments.sinf', function(event) {
                event.preventDefault();
                $(this).removeClass("sinf");
                let id = $(this).attr("data-id");        
                $("<form id='com'><textarea></textarea><input type='button' value='publicar' class='publicar' data-id='"+id+"'></form>").insertAfter(this);        
              });  

              $(document).on("click",".fa-comments",function(){
                $(this).addClass("blue");             
             });  
      
              $(document).on('click', '#menu', function(event) {
                  $("#navfav").slideToggle("slow");
            });            	
      
              function listarfav(){
                let acumula = ""
              for(i in favoritos){
                var index = coleccion.findIndex(elemento => elemento.id==favoritos[i]);
                console.log(index);
                acumula +=  "<li><img src="+coleccion[index].thumbnailUrl+" width='50'><input type='button' value='Eliminar' onclick='eliminafav("+i+")'></li>"
              }
              $("#navfav ul").html(acumula);
              let favstring = JSON.stringify(favoritos);
              localStorage.setItem("favoritoslocal",favstring);
                console.log(favoritos);
              }
      
              function eliminafav(i){
                favoritos.splice(i, 1);
                listarfav();
                filtrarImg();
      
              }
      
              $(document).on('click', '.publicar', function(event) {
                  let texto = $(this).prev('textarea').val();
                  let id = parseInt($(this).attr("data-id"));
                  $(this).parent("form").html("<p id='p'><strong>Comentario</strong><br>"+texto+"</p>");
                  db.comments.put({ idcomentario: id, comentario: texto }).then(function () {
                  console.log("Comentario guardado: "+texto)
                });           
              });
      
      
    /*
              if('serviceWorker' in navigator){
                navigator.serviceWorker.register('sw.js');
              }
*/