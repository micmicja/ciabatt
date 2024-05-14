import {
 
  PLACEMENT_TYPE_HERO,
  PLACEMENT_TYPE_GOAL,
  PLACEMENT_TYPE_WALL,
  PLACEMENT_TYPE_FLOUR,
  PLACEMENT_TYPE_CELEBRATION,
  PLACEMENT_TYPE_LOCK,
  PLACEMENT_TYPE_KEY,
  PLACEMENT_TYPE_WATER,
  PLACEMENT_TYPE_WATER_PICKUP,
  PLACEMENT_TYPE_GROUND_ENEMY,
  PLACEMENT_TYPE_FLYING_ENEMY,
  PLACEMENT_TYPE_ROAMING_ENEMY,
  PLACEMENT_TYPE_CONVEYOR,
  PLACEMENT_TYPE_ICE,
  PLACEMENT_TYPE_ICE_PICKUP,  
  PLACEMENT_TYPE_FIRE,
  PLACEMENT_TYPE_FIRE_PICKUP,
  PLACEMENT_TYPE_SWITCH_DOOR,
  PLACEMENT_TYPE_SWITCH,
  PLACEMENT_TYPE_TELEPORT,
  PLACEMENT_TYPE_THIEF,
  PLACEMENT_TYPE_CIABATTA,
  } from "../../helpers/consts";
  import styles from "./EditorDropdown.module.css";
  
  export default function EditorDropdown({ level }) {
    if (!level.enableEditing) {
      return null;
    }
  
    return (
      <div className={styles.dropdownContainer}>
        <select
          value={level.editModePlacementType}
          onChange={(event) => {
            level.setEditModePlacementType(event.target.value);
          }}
        >
          <option value={PLACEMENT_TYPE_WALL}>Wall</option>
          <option value={PLACEMENT_TYPE_FIRE}>Fire</option>
          <option value={PLACEMENT_TYPE_WATER}>Water</option>
          <option value={PLACEMENT_TYPE_SWITCH}>Purple Switch</option>
          <option value={PLACEMENT_TYPE_SWITCH_DOOR}>Door</option>
          <option value={PLACEMENT_TYPE_LOCK}>Lock</option>   
          <option value={PLACEMENT_TYPE_KEY}>key</option>
          <option value={PLACEMENT_TYPE_GROUND_ENEMY}>Genmy</option>
          <option value={PLACEMENT_TYPE_FLYING_ENEMY}>Fenemy</option>
          <option value={PLACEMENT_TYPE_ROAMING_ENEMY}>Renemy</option>
          
          <option value={PLACEMENT_TYPE_ICE}>ice</option>
          <option value={PLACEMENT_TYPE_ICE_PICKUP}>icepickup</option>
          <option value={PLACEMENT_TYPE_FIRE_PICKUP}>fireipup</option>
          <option value={PLACEMENT_TYPE_TELEPORT}>tele</option>
          <option value={PLACEMENT_TYPE_THIEF}>thief</option>
          <option value={PLACEMENT_TYPE_CIABATTA}>ciabatta</option>
          <option value={ PLACEMENT_TYPE_WATER_PICKUP}>waterpicup</option>
         
          
        </select>
        <button
          onClick={() => {
            level.copyPlacementsToClipboard();
          }}
        >
          Export
        </button>
      </div>
    );
  }
  