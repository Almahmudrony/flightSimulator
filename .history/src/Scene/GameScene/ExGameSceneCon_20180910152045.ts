import {AssetsManager, SceneManager} from "../../public/index";
import {DisplayPool} from "../../public/index";
import {ModuleName} from "../../public/index";
import {EventCon} from "../../other/EventCon";
import {ExGameScene} from "./ExGameScene";
import {GameScenes} from "../../public/index";
import {particleCon} from "../../public/index";
import {WeatherState} from "../../public/index";


export class ExGameSceneCon extends GameScenes{
    private _gold;
    private static instance: ExGameSceneCon;

    public static get ins(): ExGameSceneCon {
        if (!this.instance) {
            this.instance = new ExGameSceneCon();
        }
        return this.instance;
    }


    protected display;

    protected scene;

    private gameDeState;

    constructor(){
        super()
    }

    protected importMeshes=[]


    public init(){
        DisplayPool.ins.displayPool[ModuleName.GAME_PLAY_SCENE]=this;
    }

    protected resetGame(){
        ExGameScene.ins.creatScene()
        var scene=SceneManager.ins.scene;
        this.scene=SceneManager.ins.scene;
        this.display=ExGameScene.ins.display;
        SceneManager.ins.engine.displayLoadingUI();
        SceneManager.ins.engine.loadingUIText = "Initializing...";
        SceneManager.ins.engine.hideLoadingUI();


        console.log(this.scene)


        this.scene.createDefaultSkybox(AssetsManager.ins.resourceObject["cubeTextures"]["gameScene"]["skybox"], true, 10000);

        this.scene.getMeshByName("__root__").scaling=new BABYLON.Vector3(100,100,100)

        BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (plugin) {
           // currentPluginName = plugin.name;
                if (plugin.name === "gltf" && plugin instanceof BABYLON.GLTFFileLoader) {
                    plugin.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.NONE;
                    plugin.compileMaterials = true;
                }
            });

        this.display.camera.target=this.scene.getMeshByName("__root__").position;

        this.scene.beginAnimation(this.scene.skeleton, 0, 0.001, false);
        console.log( "this.scene")
        console.log( this.scene)
    }
}
