import { PLACEMENT_TYPE_HERO, PLACEMENT_TYPE_WALL } from "../helpers/consts";
import { placementFactory } from "./PlacementFactory";
import { GameLoop } from "./GameLoop";
import { DirectionControls } from "./DirectionControls";
import LevelsMap from "../levels/LevelsMap";
import { Inventory } from "./Inventory";
import { LevelAnimatedFrames } from "./LevelAnimatedFrames";
import { Camera } from "./Camera";
import { Clock } from "./Clock";

export class LevelState {
  constructor(levelId, onEmit) {
    this.id = levelId;
    this.onEmit = onEmit;
    this.directionControls = new DirectionControls();
    this.editModePlacementType = PLACEMENT_TYPE_WALL;

    //Start the level!
    this.start();
  }

  start() {
    this.isCompleted = false;
    this.deathOutcome = null;
    const levelData = LevelsMap[this.id];

    this.theme = levelData.theme;
    this.tilesWidth = levelData.tilesWidth;
    this.tilesHeight = levelData.tilesHeight;
    this.placements = levelData.placements.map((config) => {
      return placementFactory.createPlacement(config, this);
    });

    // Create a fresh inventory
    this.inventory = new Inventory();

    // Create a frame animation manager
    this.animatedFrames = new LevelAnimatedFrames();

    // Cache a reference to the hero
    this.heroRef = this.placements.find((p) => p.type === PLACEMENT_TYPE_HERO);

    // Create a camera
    this.camera = new Camera(this);

    // Create a clock
    this.clock = new Clock(90, this);

    this.startGameLoop();
  }

  startGameLoop() {
    this.gameLoop?.stop();
    this.gameLoop = new GameLoop(() => {
      this.tick();
    });
  }

  addPlacement(config) {
    this.placements.push(placementFactory.createPlacement(config, this));
  }

  deletePlacement(placementToRemove) {
    this.placements = this.placements.filter((p) => {
      return p.id !== placementToRemove.id;
    });
  }

  copyPlacementsToClipboard() {
    // Convert the Placements to type,x,y JSON
    const placementsData = this.placements.map((p) => {
      return {
        x: p.x,
        y: p.y,
        type: p.type,
        
      };
    });

    // Copy the data to the clipboard for moving into map files after editing
    navigator.clipboard.writeText(JSON.stringify(placementsData)).then(
      () => {
        console.log("Content copied to clipboard");

        // Also console log the output
        console.log(placementsData);
      },
      () => {
        console.error("Failed to copy");
      }
    );
  }

  setEditModePlacementType(newType) {
    this.editModePlacementType = newType;
  }

  tick() {
    // Check for movement here...
    if (this.directionControls.direction) {
      this.heroRef.controllerMoveRequested(this.directionControls.direction);
    }

    // Call 'tick' on any Placement that wants to update
    this.placements.forEach((placement) => {
      placement.tick();
    });

    // Work on animation frames
    this.animatedFrames.tick();

    // Update the camera
    this.camera.tick();

    // Update the clock
    //this.clock.tick(); // TODO - put me back!

    //Emit any changes to React
    this.onEmit(this.getState());
  }

  isPositionOutOfBounds(x, y) {
    return (
      x === 0 ||
      y === 0 ||
      x >= this.tilesWidth + 1 ||
      y >= this.tilesHeight + 1
    );
  }

  switchAllDoors() {
    this.placements.forEach((placement) => {
      if (placement.toggleIsRaised) {
        placement.toggleIsRaised();
      }
    });
  }

  stealInventory() {
    this.placements.forEach((p) => {
      p.resetHasBeenCollected();
    });
    this.inventory.clear();
  }

  setDeathOutcome(causeOfDeath) {
    this.deathOutcome = causeOfDeath;
    this.gameLoop.stop();
  }

  completeLevel() {
    this.isCompleted = true;
    this.gameLoop.stop();
  }

  getState() {
    return {
      theme: this.theme,
      tilesWidth: this.tilesWidth,
      tilesHeight: this.tilesHeight,
      placements: this.placements,
      deathOutcome: this.deathOutcome,
      isCompleted: this.isCompleted,
      cameraTransformX: this.camera.transformX,
      cameraTransformY: this.camera.transformY,
      secondsRemaining: this.clock.secondsRemaining,
      inventory: this.inventory,
      restart: () => {
        this.start();
      },

      // Edit Mode API
      enableEditing: true,
      editModePlacementType: this.editModePlacementType,
      addPlacement: this.addPlacement.bind(this),
      deletePlacement: this.deletePlacement.bind(this),
      setEditModePlacementType: this.setEditModePlacementType.bind(this),
      copyPlacementsToClipboard: this.copyPlacementsToClipboard.bind(this),
    };
  }

  destroy() {
    this.gameLoop.stop();
    this.directionControls.unbind();
  }
}
