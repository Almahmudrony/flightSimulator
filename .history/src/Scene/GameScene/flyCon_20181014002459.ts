/**
 * 飞行控制系统   by renjianfeng 
 */

import {AssetsManager} from "../../public"
import {SceneManager} from "../../public"
import {Func} from "../../public"

export class FlyCon{

    private static instance: FlyCon;

    public static get ins(): FlyCon {
        if (!this.instance) {
            this.instance = new FlyCon();
        }
        return this.instance;
    }

   
    private display
    private scene


    //帧率时间补偿

    private times;
  

    //UI系列
    private rect2;
    private rect3;
    private image;

    //通过空格键控制第一人称的自由视角
    private freeView;

    //视角
    private viewState=true;

    //飞行速度
    private flySpeed=2;

    private character

    private musics;

   

    private creatMusic(){
        this.musics={
            zhanji:new BABYLON.Sound("zhanji",[AssetsManager.ins.resourceObject["binarys"]["gameScene"]["zhanji"]["url"]] , this.scene,()=>{
                this.musics.zhanji.play()
                setInterval(()=>{
                   // this.musics.zhanji.stop()
                    this.musics.zhanji.play()
                },60)
            },{loop:false}),
        }
    }

    //创建UI
    private creatUI(){
    
    this.rect2 = new BABYLON.GUI.Rectangle();
    this.rect2.scaleX=0.7;
    this.rect2.scaleY=0.7;
    this.rect2.alpha=0.8;
    this.rect2.width = "700px";
    this.rect2.height = "400px";
   // this.rect1.cornerRadius = 5;
    this.rect2.color = "#009855";
    this.rect2.thickness = 0;

    console.log(this.rect2)
    console.log("this.rect2")



    this.rect3 = new BABYLON.GUI.Rectangle();

    this.rect3.width = "300px";
    this.rect3.verticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    this.rect3.height = "10800px";
    this.rect3.top="0";
    this.rect3.left="10px";
    this.rect3.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    //this.rect1.cornerRadius = 5;
    //this.rect3.background = "#009855";
    this.rect3.thickness = 0;
    this.rect2.addControl(this.rect3);


   // AssetsManager.ins.resourceObject["images"]["gameScene"]["jiantou"].clone()

    this.image = new BABYLON.GUI.Image("but", AssetsManager.ins.resourceObject["images"]["gameScene"]["jiantou"].src);
    this.image.width = "30px";
    console.log( "this.image")
    console.log( this.image)
    this.image.height = "15px";
    this.image.scaleX = -1;
    this.image.top="192px";
    this.image.left="110px";
    this.image.verticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    this.image.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.rect2.addControl(this.image);  

    var b5=[]
    var b6=[]
    var label=[]
    var countB=360;
    var chizi= new BABYLON.GUI.Image("but", AssetsManager.ins.resourceObject["images"]["gameScene"]["jiantou2"].src);
    for(var i=0;i<=36;i++){
        console.log(i)
        countB-=30
        if(countB<=0){
            countB=360;
        }
        b5[i]= new BABYLON.GUI.Rectangle();
        b5[i].verticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        b5[i].horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        b5[i].top=50*i*3;
        b5[i].left="-5px"
        b5[i].width = "300px";
        b5[i].height = "20px";
        //this.rect1.cornerRadius = 5;
       // b5[i].background = "#009855";
        b5[i].thickness = 0;
        this.rect3.addControl( b5[i]);
        label[i] = new BABYLON.GUI.TextBlock();
        if(countB==0||countB==360){
            label[i].text = ""+0+"°";
            label[i].color="#ffffff"
        }else{
            label[i].text = ""+countB+"°";
            label[i].color="#129604"
        }
        
        
        label[i].textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        label[i].fontSize="18px"


       

        b5[i].addControl(label[i]);
        b5[i].addControl(chizi);

    }


  
    this.display.advancedTexture.addControl( this.rect2);

    }

    //初始化
    public init(display){
        this.scene=SceneManager.ins.scene;
        this.display=display

        //创建准星
        this.creatUI()
        //创建事件
        this.addEvent()
        //创建音频
        this.creatMusic()

       /*  setTimeout(()=>{
            this.musics.zhanji.play()
            console.log("this.musics.zhanji")
            console.log(this.musics.zhanji)
            this.musics.zhanji.addEventListener("progress",()=>{
                if(this.musics.zhanji.currentTime==10){
                    this.musics.zhanji.currentTime=6
                }
            })
        },6000) */
      //  currentTime=10

        /* this.musics.zhanji.addEventListener("progress",()=>{
            if(this.musics.zhanji.currentTime==10){
                this.musics.zhanji.currentTime=6
            }
        }) */
    }


    //事件
    private addEvent(){

        this.freeView=false;

        document.addEventListener("keydown",(e)=>{
            　if (e.keyCode == 86) {
    　　      }
              if (e.keyCode == 32) {
                this.freeView=true;
    　　      }
        })

        document.addEventListener("keyup",(e)=>{
              if (e.keyCode == 32) {
                this.freeView=false;
    　　      }
        })
        this.keyevent()
    }

    //更新方法
    public update(times):void{


        this.rect2.linkWithMesh(this.display.pickMesh)

        this.times= times;
        this._s=this.moveX;
        if(this.freeView==false){
            this.display.cameraBox.rotation.z=-this.moveX*0.001;
            this.display.camera2.rotation=new BABYLON.Vector3(0.3,-Math.PI*2,0)
            if(this.moveY>=50||this.moveY<=-50){
                this.display.cameraBox.rotation.x-=this.moveY/80000*this.times

                this.musics.zhanji.setPlaybackRate(this.display.cameraBox.rotation.x/10+1)
            }
            if(this.display.cameraBox.rotation.x>Math.PI*2){
                this.display.cameraBox.rotation.x=0
            }
  
            if(this.display.cameraBox.rotation.x<=-Math.PI*2){
                this.display.cameraBox.rotation.x=0
            }
             this.display.camera2.detachControl(SceneManager.ins.canvas);
        }else{
             this.display.camera2.attachControl(SceneManager.ins.canvas);
        }
      
       // this.scene.getMeshByName("尾翼").rotation=new BABYLON.Vector3(0,1,0);
        var gravity = 0;
        this.character = this.display.cameraBox;
       /*  this.character.ellipsoid = new BABYLON.Vector3(3,6, 3);
        this.character.ellipsoidOffset = new BABYLON.Vector3(0, 3.2, 0); */
        var forwards
           this.canardUpdate()
           this.empennageUpdate()
           this.wingsUpdate()
           this.airflowUpdate()

           this.rect2.rotation=-this.display.cameraBox.rotation.z;
           this.display.cameraBox.rotation.y-=this.display.cameraBox.rotation.z/50*this.times;
           this.rect3.top=(-1460-1800*this.display.cameraBox.rotation.x/(Math.PI*2))+"px";
            if(this.display.cameraBox.rotation.z>0){
               // console.log("2223355")
            }
    
            var forword=new BABYLON.Vector3(this.character.forward.x*2*this.times*this.flySpeed,this.character.forward.y*2*this.times*this.flySpeed,this.character.forward.z*2*this.times*this.flySpeed)
     
            this.character.moveWithCollisions(forword);
    }


    private  _s=0;
    private  _s_y=0;
    private  moveX=0;
    private  moveY=0;
    private  eleImage;

    private keyevent():void{

        document.addEventListener("click",(e)=>{
            // alert(e.button)
             if(e.button==2){
                 this.viewCtrl()
                 console.log(4566588)
             }
        })

      
      
        this.eleImage = document.getElementById('renderCanvas');
            if (this.eleImage) {
                // 起始值
              //  var moveX = 0, moveY = 0;
                // 图片无限变换的方法
                var rotate3D =  (event)=> {

                    if(this.freeView==false){
                       
                        var _moveX =this.moveX + event.movementX;
                        var _moveY =this.moveY + event.movementY;

                        if(_moveX>=1500||_moveX<=-1500){
                            this.moveX=this.moveX
                            _moveX=this.moveX
                        }else{
                            this.moveX = _moveX;
                        }

                        if(_moveY>=1500||_moveY<=-1500){
                            this.moveY=this.moveY
                            _moveY=this.moveY
                        }else{
                            this.moveY = _moveY;
                        }
                      //  this.moveY = this.moveY + event.movementY;
    
                        if(this.moveX*0.001>Math.PI*2){
                            this.moveX=0
                        }
            
                        if(this.moveX*0.001<=-Math.PI*2){
                            this.moveX=0
                        }
                    }
                 
                };

                // 触发鼠标锁定
                this.eleImage.addEventListener('click',  (e)=> {
                    this.eleImage.requestPointerLock();
                });

                // 再次点击页面，取消鼠标锁定处理
              /*   document.addEventListener('click', ()=> {
                    if (document.pointerLockElement == eleImage) {
                        document.exitPointerLock();
                    }
                }); */



                // 检测鼠标锁定状态变化
                document.addEventListener('pointerlockchange', ()=> {

                    if (document.pointerLockElement == this.eleImage) {
                        document.addEventListener("mousemove", rotate3D, false);

                       
                    } else {
                        document.removeEventListener("mousemove", rotate3D, false);
                    
                    }
                }, false);
            }

           
    }

    private flayState=[];

    private setMeshVal(mesh,state,val){


        var _sd=[];
        _sd["up-go"+mesh.name]=this.scene.beginWeightedAnimation(mesh, 0, 0.7916666865348816*val,0, false);
        _sd["up-back"+mesh.name]=this.scene.beginWeightedAnimation(mesh, 0.7916666865348816, 1.625*val,0, false);
        _sd["down-go"+mesh.name]=this.scene.beginWeightedAnimation(mesh, 1.625, 2.4583332538604736*val,0, false);
        _sd["down-back"+mesh.name]=this.scene.beginWeightedAnimation(mesh, 2.4583332538604736, 3.2916667461395264*val,0, false);
        _sd["back"+mesh.name]=this.scene.beginWeightedAnimation(mesh, 3.0*val, 3.2916667461395264*val,0, false);

        this.flayState[mesh.name]=state;

       if(state=="up-go"){
           //console.log("4455")
           _sd["up-go"+mesh.name].weight = 1
           _sd["up-back"+mesh.name].weight = 0
           _sd["down-go"+mesh.name].weight = 0
           _sd["down-go"+mesh.name].weight = 0
           _sd["back"+mesh.name].weight = 0
          /*  _sd.forEach((sd,i)=>{
               console.log("sd")
               console.log(sd)
               console.log(i)
           }) */
           
       }

       if(state=="up-back"){
        _sd["up-go"+mesh.name].weight = 0
        _sd["up-back"+mesh.name].weight = 1
        _sd["down-go"+mesh.name].weight = 0
        _sd["down-go"+mesh.name].weight = 0
        _sd["back"+mesh.name].weight = 0
           // this.scene.beginAnimation(mesh, 0.7916666865348816, 1.625*val, false);
       }

       if(state=="down-go"){
        _sd["up-go"+mesh.name].weight = 0
        _sd["up-back"+mesh.name].weight = 0
        _sd["down-go"+mesh.name].weight = 1
        _sd["down-back"+mesh.name].weight = 0
        _sd["back"+mesh.name].weight = 0
           // this.scene.beginAnimation(mesh, 1.625, 2.4583332538604736*val, false);
       }

       if(state=="down-back"){
        _sd["up-go"+mesh.name].weight = 0
        _sd["up-back"+mesh.name].weight = 0
        _sd["down-go"+mesh.name].weight = 0
        _sd["down-back"+mesh.name].weight = 1
        _sd["back"+mesh.name].weight = 0
           // this.scene.beginAnimation(mesh, 2.4583332538604736, 3.2916667461395264*val, false);
       }
       if(state=="back"){
        _sd["up-go"+mesh.name].weight = 0
        _sd["up-back"+mesh.name].weight = 0
        _sd["down-go"+mesh.name].weight = 0
        _sd["down-back"+mesh.name].weight = 0
        _sd["back"+mesh.name].weight = 1
        console.log("中")
           // this.scene.beginAnimation(mesh, 2.4583332538604736, 3.2916667461395264*val, false);
       }
    }

    private  canardUpdate(){
        if(this.display.cameraBox.rotation.x>0.1){
          //  console.log("大")
            if(this.flayState["鸭翼左"]!="up-go"){
                this.setMeshVal(this.scene.getMeshByName("鸭翼左"),"up-go",1)
            }

            if(this.flayState["鸭翼右"]!="up-go"){
                //this.airflowCon(true)
                this.setMeshVal(this.scene.getMeshByName("鸭翼右"),"up-go",1)
            }
        }

        if(this.display.cameraBox.rotation.x<-0.1){
           // console.log("大")
            if(this.flayState["鸭翼左"]!="down-go"){
               
                this.setMeshVal(this.scene.getMeshByName("鸭翼左"),"down-go",1)
            }
            if(this.flayState["鸭翼右"]!="down-go"){
                this.setMeshVal(this.scene.getMeshByName("鸭翼右"),"down-go",1)
            }
           
        }


        if(this.display.cameraBox.rotation.x>=-0.1&&this.display.cameraBox.rotation.x<=0.1){

       
            if(this.flayState["鸭翼左"]=="down-go"){
                if(this.flayState["鸭翼左"]!="down-back"){
                  

                  //  console.log("中2")
                    this.setMeshVal(this.scene.getMeshByName("鸭翼左"),"down-back",1)
                }
            }

            if(this.flayState["鸭翼左"]=="up-go"){
                if(this.flayState["鸭翼左"]!="up-back"){
                    

                  //  console.log("中2")
                    this.setMeshVal(this.scene.getMeshByName("鸭翼左"),"up-back",1)
                }
            }

            if(this.flayState["鸭翼右"]=="down-go"){
                if(this.flayState["鸭翼右"]!="down-back"){
                
                   // console.log("中2")
                    this.setMeshVal(this.scene.getMeshByName("鸭翼右"),"down-back",1)
                }
            }

            if(this.flayState["鸭翼右"]=="up-go"){
                if(this.flayState["鸭翼右"]!="up-back"){
             

                  //  console.log("中2")
                    this.setMeshVal(this.scene.getMeshByName("鸭翼右"),"up-back",1)
                }
            }

           
        }
    }



    private empennageUpdate(){
        if(this.display.cameraBox.rotation.z>0.3){
            //console.log("大")
            if(this.flayState["尾翼"]!="up-go"){
                this.setMeshVal(this.scene.getMeshByName("尾翼"),"up-go",1)
            }
        }

        if(this.display.cameraBox.rotation.z<-0.3){
           // console.log("大")
            if(this.flayState["尾翼"]!="down-go"){
                this.setMeshVal(this.scene.getMeshByName("尾翼"),"down-go",1)
            }
        }


        if(this.display.cameraBox.rotation.z>=-0.3&&this.display.cameraBox.rotation.z<=0.3){
       
            if(this.flayState["尾翼"]=="down-go"){
                if(this.flayState["尾翼"]!="down-back"){
                   // console.log("中2")
                    this.setMeshVal(this.scene.getMeshByName("尾翼"),"down-back",1)
                }
            }

            if(this.flayState["尾翼"]=="up-go"){
                if(this.flayState["尾翼"]!="up-back"){
                    //console.log("中2")
                    this.setMeshVal(this.scene.getMeshByName("尾翼"),"up-back",1)
                }
            }
        }
    }


    private wingsUpdate(){
             //  this.character.rotation.y=
             if(this._s>this.moveX){
             //   console.log("大")
                if(this.flayState["右翼"]!="up-go"){
                    this.setMeshVal(this.scene.getMeshByName("右翼"),"up-go",1)
                }
    
                if(this.flayState["左翼"]!="down-go"){
                    this.setMeshVal(this.scene.getMeshByName("左翼"),"down-go",1)
                }
            }
    
            if(this._s<this.moveX){
                if(this.flayState["右翼"]!="down-go"){
                    this.setMeshVal(this.scene.getMeshByName("右翼"),"down-go",1)
                }
              //  console.log("小")
                if(this.flayState["左翼"]!="up-go"){
                    this.setMeshVal(this.scene.getMeshByName("左翼"),"up-go",1)
                }
            }
    
            if(this._s==this.moveX){
               
                if(this.flayState["右翼"]=="down-go"){
                    if(this.flayState["右翼"]!="down-back"){
                     //   console.log("中2")
                        this.setMeshVal(this.scene.getMeshByName("右翼"),"down-back",1)
                    }
                }
    
                if(this.flayState["右翼"]=="up-go"){
                    if(this.flayState["右翼"]!="up-back"){
                      //  console.log("中2")
                        this.setMeshVal(this.scene.getMeshByName("右翼"),"up-back",1)
                    }
                }
               
               // console.log("小")
               if(this.flayState["左翼"]=="down-go"){
                    if(this.flayState["左翼"]!="down-back"){
                      //  console.log("中2")
                        this.setMeshVal(this.scene.getMeshByName("左翼"),"down-back",1)
                    }
               }
    
               if(this.flayState["左翼"]=="up-go"){
                    if(this.flayState["左翼"]!="up-back"){
                     //   console.log("中2")
                        this.setMeshVal(this.scene.getMeshByName("左翼"),"up-back",1)
                    }
                }
                
            }
    }


     


      private airflowUpdate(){
        if(this.display.cameraBox.rotation.x>0.1){
            this.airflowCon(false)
        }
  
        if(this.display.cameraBox.rotation.x<-0.1){
            this.airflowCon(true)
        }
  
        if(this.display.cameraBox.rotation.x>=-0.1&&this.display.cameraBox.rotation.x<=0.1){
            this.airflowCon(false)
        }
      }


      private airflowConTime;
      private airflowConState;

      private airflowCon(airflowConState){

        if(this.airflowConState==airflowConState){
            return;
        }

        console.log("airflowCon")
        clearInterval(this.airflowConTime);
        
        if(airflowConState){
            this.airflowConTime=setInterval(()=>{ 
                this.scene.getMeshByName("气流1").isVisible=!this.scene.getMeshByName("气流1").isVisible;
                this.scene.getMeshByName("气流2").isVisible=!this.scene.getMeshByName("气流2").isVisible;
            },30)
        }else{
            this.scene.getMeshByName("气流1").isVisible=false;
            this.scene.getMeshByName("气流2").isVisible=false;
        }

        this.airflowConState=airflowConState
      }


   
 /**
     * 页面UI控制
     * */
    private viewCtrl():void{
        this.viewState=!this.viewState;
        if(this.viewState==true){
         //   this.display.camera2.detachControl(SceneManager.ins.canvas,false);
           // this.scene.activeCamera=this.display.camera3
           this.scene.activeCameras=[]
            this.scene.activeCameras.push(this.display.camera3);
            this.scene.activeCameras.push(this.display.camera4);
            this.scene.activeCameras.push(this.display.camera5);
            this.scene.getMeshByName("驾驶员头").isVisible=true;
           // this.display.camera3.alpha=-Math.PI*1;
           // this.display.camera3.beta=1.260483446598473
          //  this.display.camera.attachControl(SceneManager.ins.canvas,true);

        }else{
          //  this.display.camera.detachControl(SceneManager.ins.canvas,false);
        //    this.scene.activeCamera=this.display.camera2
            this.scene.activeCameras=[]
            this.scene.activeCameras.push(this.display.camera2);
            this.scene.activeCameras.push(this.display.camera4);
            this.scene.activeCameras.push(this.display.camera5);
            this.scene.getMeshByName("驾驶员头").isVisible=false;
          //  this.display.camera2.rotation=new BABYLON.Vector3(0.1,Math.PI*0.5,0)
          //  this.display.camera2.attachControl(SceneManager.ins.canvas,true);
        }
    }

    /*   private barrierConTime;
      private barrierConState;

      private barrierCon(barrierConState){

        if(this.barrierConState==barrierConState){
            return;
        }

        console.log("airflowCon")
        clearInterval(this.barrierConTime);
        
        if(barrierConState){
            this.barrierConTime=setInterval(()=>{ 

                this.scene.getMeshByName("气流3").isVisible=!this.scene.getMeshByName("气流3").isVisible;
             //   this.scene.getMeshByName("气流2").isVisible=!this.scene.getMeshByName("气流2").isVisible;
            },30)
        }else{
            this.scene.getMeshByName("气流3").isVisible=false;
            //this.scene.getMeshByName("气流2").isVisible=false;
        }

        this.barrierConState=barrierConState
      } */
}


