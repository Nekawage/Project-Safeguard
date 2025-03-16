const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/ship/ship0.png");
ASSET_MANAGER.queueDownload("./sprites/ship/ship1.png");
ASSET_MANAGER.queueDownload("./sprites/ship/ship2.png");
ASSET_MANAGER.queueDownload("./sprites/ship/ship3.png");
ASSET_MANAGER.queueDownload("./sprites/ship/ship_rocket.png");
ASSET_MANAGER.queueDownload("./sprites/munbig.png");
ASSET_MANAGER.queueDownload("./sprites/asteroid/asteroid_big1.png");
ASSET_MANAGER.queueDownload("./sprites/asteroid/asteroid_big2.png");
ASSET_MANAGER.queueDownload("./sprites/asteroid/asteroid_medium1.png");
ASSET_MANAGER.queueDownload("./sprites/asteroid/asteroid_medium2.png");
ASSET_MANAGER.queueDownload("./sprites/asteroid/asteroid_medium3.png");
ASSET_MANAGER.queueDownload("./sprites/asteroid/asteroid_small1.png");
ASSET_MANAGER.queueDownload("./sprites/asteroid/asteroid_small2.png");
ASSET_MANAGER.queueDownload("./sprites/asteroid/asteroid_small3.png");
ASSET_MANAGER.queueDownload("./sprites/asteroid/asteroid_small4.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false; 
	
	gameEngine.init(ctx);

	gameEngine.addEntity(new Mun(gameEngine, 440, 440));
	gameEngine.addEntity(new Player(gameEngine, 488, 280));

	gameEngine.start();
});
