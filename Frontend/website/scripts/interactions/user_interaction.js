import { check_unlocked, addStructureToHash } from "../calculations/Structures.js";
import { potentialBuildTime } from "../calculations/Calculations.js";
import { getBuildingVariables } from "../calculations/utils/variableGetUtils.js";

// Determines Immortal Selected
const IMMORTAL_DROPDOWN = document.querySelector("#immortal");
const IMMORTAL_SELECTION = document.querySelectorAll(".dropdownImmortal .menu ul li");
var immortal = "Xol";

IMMORTAL_SELECTION.forEach(element => {
    element.addEventListener("click", () => {
        IMMORTAL_DROPDOWN.innerHTML = element.innerHTML + "<span class ='arrow down'></span>";
        immortal = element.innerHTML;
        
        if(IMMORTAL_DROPDOWN.innerHTML === "Dekker<span class=\"arrow down\"></span>"){
            alert("Dekker is currently unavailable, please choose another IMMORTAL. We are sorry for the inconvenience.")
            IMMORTAL_DROPDOWN.innerHTML = "Immortal<span class=\"arrow down\"></span>";
            immortal = "Xol";
        }
        if(IMMORTAL_DROPDOWN.innerHTML === "N.A.<span class=\"arrow down\"></span>"){
            alert("N.A. is currently unavailable, please choose another IMMORTAL. We are sorry for the inconvenience.")
            IMMORTAL_DROPDOWN.innerHTML = "Immortal<span class=\"arrow down\"></span>";
            immortal = "Xol";
        }
        console.log(immortal);
    });
});

// Declutters Menu when user clicks submenus
function declutterMenuSubheading(){
    const SUBHEADINGS = document.querySelectorAll('.dropdownChoice .menu input[type="checkbox"]');
    [...SUBHEADINGS].forEach((subheading) =>{
        subheading.addEventListener('click', (clicked) => {
            [...SUBHEADINGS].forEach((option) => {
                if (option !== clicked.target){
                    option.checked = false;
                }
            });
        })
    });
}

function declutterDropdownChoice(){
    const HEADINGS =  document.querySelectorAll('.dropdownHeading');
    [...HEADINGS].forEach((heading) =>{
        heading.addEventListener('click', (clicked) => {
            [...HEADINGS].forEach((option) => {
                if (option !== clicked.target){
                    option.checked = false;
                }
            });
        })
    });
    console.log(HEADINGS);
}


declutterDropdownChoice();
declutterMenuSubheading();

// Code for creating html depending on the actions available
let actionChecked = false;
const ACTION_DROPDOWN = document.querySelector('div.next_action_container .menu');
const ACTION_DROPDOWN_CLICKABLE = document.querySelector('div.next_action_container label');

function closeMenu(){
    document.getElementById("btn-action").checked = false;
}

function getNextAction(){
    const ACTIONSELECTION = document.querySelectorAll('.next_action_container .menu ul li');
    ACTIONSELECTION.forEach((action) =>{
        action.addEventListener('click',() =>{
            createActionCard(action.innerHTML);
            closeMenu();
            createTooltips();
        });
    })
}

function createActionCard(actionName){
    console.log(actionName);
    addStructureToHash(actionName);
    let building = getBuildingVariables(actionName);
    let newAction =`
    <div class="action">
        <div class="action_header">`+actionName+`</div>
        <div class="flexbox-container">
          <div class="action_image">
            <img class="symbiote_walk" src="" alt="">
            <img class="structure_unit" src=`+building.files.img+` alt="">
            <div class="icon_tooltip"></div>
          </div>
          <div class="action_icons">
            <div class="top_images">
                <img src="images/action_icons/Time.svg" alt="" class="icon time_icon">
                <img src="images/action_icons/Healthv2.svg" alt="" class="icon health_icon">
                <img src="images/action_icons/Alloy.svg" alt="" class="icon alloy_icon">
                <img src="images/action_icons/Ether.svg" alt="" class="icon ether_icon">

                <img src="images/action_icons/All.svg" alt="" class="icon all_icon">
            </div>

            <div class="bottom_images">
              <img src=`+building.files.icon+` alt="" class = "icon all_icon">
              <img src="images/action_icons/Unlock.svg" alt="" class="icon unlock_icon">
              <img src="images/action_icons/Upgrade.svg" alt="" class="icon upgrade_icon">
              <img src="images/action_icons/Cancel.svg" alt="" class="icon cancel_icon">
            </div>
          </div>
        </div>
        <div class="action_initial">
          <img src="images/action_icons/start.svg" alt=""><b>`+building.texts.startText+`</b>
        </div>
        <div class="action_current">
          <img src="images/action_icons/now.svg" alt=""><b>`+building.texts.startText+`</b>
        </div>
      </div>
      <img src="images/action_icons/right_arrow.svg" alt="">
      `
      document.getElementById('actionChoice').insertAdjacentHTML("beforebegin", newAction);
}

function possibleActionsList(type){
    let unlocked = check_unlocked(type);
    let possible = '';
    unlocked.forEach(actionName => {
        let time = potentialBuildTime(actionName, type);
        if (time !== undefined){
            possible+=
            `
               <li>`+actionName+`</li>`;
        }
    });
    return(possible);

}


ACTION_DROPDOWN_CLICKABLE.addEventListener("click", () =>{

    let listOptions =
    `
        <li>
            <label for="btn-Build" class="first"><b>Build</b><span class="arrow down"></span></label>
            <input type="checkbox" name="action" id="btn-Build" />
            <ul>`

                +possibleActionsList("building")+

    `
           </ul>
        </li>
        <li>
            <label for="btn-Train" class="first"><b>Train</b><span class="arrow down"></span></label>
            <input type="checkbox" name="action" id="btn-Train" />
            <ul>`
            
                +possibleActionsList("unit")+
            
    `
            </ul>
        </li>

        <li>
        <label for="btn-Upgrade" class="first"><b>Upgrade</b><span class="arrow down"></span></label>
        <input type="checkbox" name="action" id="btn-Upgrade" />
        <ul>`
        
            +possibleActionsList("upgrade")+
        
`
        </ul>
        </li>
    
        `;

    ACTION_DROPDOWN.innerHTML = listOptions;

    declutterMenuSubheading();
    declutterDropdownChoice();
    getNextAction();
});

function createTooltips(){
    var icons = document.querySelectorAll('.action_icons .icon');
    icons.forEach(icon => {
        let container = icon.closest(".flexbox-container");
        let tooltip = container.querySelector(".icon_tooltip");
        let display = "none";

        

        icon.addEventListener('mouseenter', ()=>{
            toolTipStyling(icon.classList[1], tooltip);
            toolTipContent(icon.classList[1], tooltip);

        }); 
        icon.addEventListener('mouseleave', ()=>{
            tooltip.addEventListener('mouseenter', ()=>{tooltip.style.display = "block";});
            tooltip.addEventListener('mouseleave', ()=>{tooltip.style.display = "none";});
            tooltip.style.display = "none";
        });

    });
    
}

function toolTipStyling(iconName, iconToolTip){
    // console.log(iconName);
    if(["time_icon","health_icon", "ether_icon"].includes(iconName)){
        iconToolTip.style.width = "125px";        
        iconToolTip.style.height = "125px";   
        iconToolTip.style.display = "block";
        iconToolTip.style.right = "0";
        iconToolTip.style.top = "0"; 
        iconToolTip.style.bottom = "auto"; 
        iconToolTip.style.borderRadius = "10px 0px 0px 10px";
    }

    if(iconName === "alloy_icon"){
        iconToolTip.style.width = "125px";        
        iconToolTip.style.height = "225px";   
        iconToolTip.style.display = "block";
        iconToolTip.style.right = "0";
        iconToolTip.style.top = "0"; 
        iconToolTip.style.bottom = "auto"; 
        iconToolTip.style.borderRadius = "10px 0px 0px 10px";

    }

    if(iconName === "all_icon"){
        iconToolTip.style.width = "225px";        
        iconToolTip.style.height = "225px";   
        iconToolTip.style.display = "block";
        iconToolTip.style.right = "0";
        iconToolTip.style.top = "0";
        iconToolTip.style.bottom = "auto";
        iconToolTip.style.borderRadius = "0";

    }

    if(["worker_icon","upgrade_icon","cancel_icon"].includes(iconName)){
        iconToolTip.style.width = "125px";        
        iconToolTip.style.height = "125px";   
        iconToolTip.style.display = "block";
        iconToolTip.style.right = "0";
        iconToolTip.style.bottom = "0";
        iconToolTip.style.top = "auto";  
        iconToolTip.style.borderRadius = "10px 0px 0px 10px";
    }

    if(iconName ==="unlock_icon"){
        iconToolTip.style.width = "225px";        
        iconToolTip.style.height = "125px";   
        iconToolTip.style.display = "block";
        iconToolTip.style.right = "0";
        iconToolTip.style.bottom = "0";
        iconToolTip.style.top = "auto";  
        iconToolTip.style.borderRadius = "10px 0px 0px 10px";

    }
}

function toolTipContent(iconName, iconToolTip){

    let tooltip_content =``;

    if(iconName === "time_icon"){
        tooltip_content =`
        
        
        <div class="flexbox-container-vertical">
            <h1 class = header>Time</h1>
            <div class="flexbox-container-vertical grow">
                <h3>Build Duration: <p class = "alloy_colour build_duration"> 1:40</p></h3>
                <h3>Current Time: <p class = "alloy_colour current_time"> 1:00</p></h3>
                <h3>Start:<span class="START start_time"> 0:00 </span> End: <span class="END end_time"> 0:00</span></h3>
                <h3>Upgrade Time:<span class="START upgrade_time"> 0:36 </span></h3>
                <h3>Build Worker:<span class="START"> 0:18 </span></h3>
            </div>
        </div>
        
        `        
    }

    if(iconName === "health_icon"){
        tooltip_content =`
        <div class="flexbox-container-vertical">
            <h1 class = "header">Hp & Shields</h1>

            <div class="flexbox-container-vertical grower">
                <div>
                    <h3>Max Health & Shields:</h3>
                    <p><span class="HP">2000</span> health <span class="SH">400</span> shields</p>
                </div>

                <div>
                    <h3>Current Hp & Shields:</h3>
                    <p><span class="HP">2000</span> health <span class="SH">400</span> shields</p>
                </div>

                <div>
                    <h3>Armour type:<span class="HP">HEAVY</span></h3>
                </div>
            </div>
        </div>
        
        `        
    }

    if(iconName === "alloy_icon"){
        tooltip_content =`
        <div class="flexbox-container-vertical">
            <h1 class = "header">Alloy</h1>
            <div class="flexbox-container-vertical grower">
                <h3>Cost: <p class="alloy_colour">400</p></h3> 
                <h3>Max Minable: <p class="alloy_colour">8000</p></h3>         
                <h3>Current Minable: <p class="alloy_colour">7830</p></h3>
                <h3>Mining Rates:</h3>
                <table>
                    <tr>
                        <th>Worker</th>
                        <th>lvl 1 Rate</th>
                        <th>lvl 2 Rate</th>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>5/4</td>
                        <td>5/4</td>
                    </tr>
                    <tr>
                    <td>2</td>
                        <td>5/2</td>
                        <td>5/2</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>35/12</td>
                        <td>15/4</td>
                    </tr>

                    <tr>
                        <td>4</td>
                        <td>10/3</td>
                        <td>5 alloy/s</td>
                    </tr>

                    <tr>
                        <td>5</td>
                        <td>10/3</td>
                        <td>65/12</td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td>10/3</td>
                        <td>35/6</td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td>10/3</td>
                        <td>25/4</td>
                    </tr>
                    <tr>
                        <td>8</td>
                        <td>10/3</td>
                        <td>20/3</td>
                    </tr>
                </table>
            </div>
        </div> 


        `        
    }

    if(iconName === "ether_icon"){
        tooltip_content =`
        <div class="flexbox-container-vertical">
            <h1 class = "header">Ether</h1>
            <div class="flexbox-container-vertical grower">
                <h3>Cost: <p class="ether_colour">0 ether</p></h3> 
                <h3>Max Minable: <p class="ether_colour">0 ether</p></h3>         
                <h3>Current minable:<p class="ether_colour">0 eth</p></h3>
                <h3>Mining Rate:<p class="ether_colour">0 ether</p></h3>
            </div>
        </div>
                `
    }

    if(iconName === "worker_icon"){
        tooltip_content =`
        <div class="flexbox-container-vertical">
            <h1 class = "header">Workers</h1>
            <div class="flexbox-container-vertical grower">
                <h3>Cost: <p class="alloy_colour">50 Alloy</p></h3> 
                <h3>Production Time: <p class="START">18s</p> </h3>         
                <h3>Health:<p class="HP">30 HP</p><p class="SH">30 SH</p></h3>
                <h3>DPS:<p class="HP">8 dmg / 0.8s</p></h3>
                <h3>1 worker/node:<p class="alloy_colour">5/4 a/s</p></h3>
                <h3>2 worker/node:<p class="alloy_colour">6/4 a/s</p></h3>
                <h3>Abilities:<p class="ether_colour">Build/Mine </p></h3>
            </div>
        </div>
                `
    }

    if(iconName === "unlock_icon"){
        tooltip_content =`
        <div class="flexbox-container-vertical">
            <h1 class = "header">Tech Tree</h1>
            <div class="flexbox-container-vertical grower">
                
                <div> 
                    <h3>Requires: <p class="SH">NOTHING</p></h3>
                    <h3>Unlocks: <p class="START">Altar, Ether Maw, GodHeart</p> </h3>       
                </div>
                
                <div> 
                    <h3>With [Building Combo] Unlocks:  <p class="START">N.A.</p> </h3> 
                    <h3>With [Building Combo] Unlocks:  <p class="START">N.A.</p> </h3> 
                    <h3>With [Building Combo] Unlocks:  <p class="START">N.A.</p> </h3> 
                </div>     
            </div>
        </div>
                `
    }

    if(iconName === "upgrade_icon"){
        tooltip_content =`
        <div class="flexbox-container-vertical">
            <h1 class = "header">Upgrades</h1>
            <div class="flexbox-container-vertical grower">
                
                <div> 
                    <h3>Building:</h3>
                    <p class="START">Groveheart => Godheart </p>
                    <h3>Cost: <p class="alloy_colour">100a</p> <p class="ether_colour">75eth</p> <p class ="START">60s</p></h3>       
                </div>
                
                <div> 
                    <h3>Mining:</h3>
                    <p class="START">Level 1 => Level 2 </p>
                    <h3>Cost: <p class="alloy_colour">300a</p> <p class="ether_colour">0eth</p> <p class ="START">60sec</p></h3>       
                </div>  
            </div>
        </div>
                `
    }

    if(iconName === "cancel_icon"){
        tooltip_content =`
        <div class="flexbox-container-vertical">
            <h1 class = "header">Cancel</h1>
            <div class="flexbox-container-vertical grower">
                
                <div> 
                    <h3>Eligible Time Refund:</h3>
                    <p class="START">0:00 to 0:00 </p>
                </div>

                <div>
                    <h3>Amount Refunded:</h3>
                    <h3><p class="alloy_colour">300a</p> <p class="ether_colour">0eth</p> <p class="HP">1 worker</p></h3>       
                </div>
                

            </div>
        </div>
                `
    }

    if(iconName === "all_icon"){
        tooltip_content =`
        <div class="flexbox-container-vertical">
            <h1 class = "header all_icon_styling_groveheart home">All Stats: Home Page</h1>
            <h1 class = "header all_icon_styling_groveheart tables hidden">All Stats: Mining Information</h1>
            <h1 class = "header all_icon_styling_groveheart description hidden">All Stats: Description</h1>
            <div class="flexbox-container-vertical grower">
                <div class="all_icon_styling home"> 
                    <h2>Generic Grove Heart Stats:</h2>
                    <h3>Build Cost: <span class ="alloy_colour">300 Alloy</span> <span class ="ether_colour">0 ether </span><span class ="START">1min 40 </span> <span class ="HP">1 worker </span></h3>
                    <h3>Healthpoints: <span class ="HP">2000 Hp </span> <span class ="SH">400 Shields </span><span class ="HP">Heavy Armour </span></h3>
                    <h3>Actions: <span class ="alloy_colour">Bld Worker</span> <span class ="ether_colour">Upgrade Mining/Godheart </span></h3>
                    <h3>Start: <span class ="alloy_colour">Lv 1 Mining</span> <span class ="HP">1/4 Workers</span> <span class ="alloy_colour">1.25 alloy/s</span></h3>
                    <h3>Build Worker: <span class ="alloy_colour">50 alloy </span> <span class ="START">18s </span> <span class ="alloy_colour">+ 5/4 or 5/6 a/s</span></h3>
                    <h3>Upgrade Mining Level: <span class ="alloy_colour">300 alloy </span> <span class ="START">60s </span> <span class ="alloy_colour"> 8/8 nodes</span></h3>
                    <h3>Upgrade to Godheart: <span class ="alloy_colour">100 alloy </span> <span class ="ether_colour">75 ether </span> <span class ="START">60s </span></h3>
                    <h3>Req/Unlock: <span class ="SH">No Req.</span><span class="START">Altar, Ether Maw, GodHeart</span></h3>
                </div>

                <div class = "all_icon_styling home">
                    <h2>Specific Stats:</h2>
                    <h3>Main Base Start: <span class ="alloy_colour">Level 2 </span> <span class ="HP">8/8 workers </span> <span class ="alloy_colour">6.66 alloy/s</span></h3>
                    <h3>Cost [Free]: <span class ="alloy_colour">0 Alloy</span> <span class ="ether_colour">0 ether </span><span class ="START">0 seconds </span> <span class ="HP">0 worker </span></h3>
                    <h3>Healthpoints: <span class ="HP">2000 Hp </span> <span class ="SH">400 Shields </span><span class ="HP">Heavy Armour </span></h3>
                    <h3>Actions: <span class ="alloy_colour">Build Worker</span> <span class ="ether_colour">Upgrade to Godheart </span></h3>                           
                </div>

                <div class = "all_icon_styling tables hidden">
                    <h3>Fractional Table</h3>
                    <table>
                        <tbody>
                            <tr>
                                <th>Worker</th>
                                <th>lvl 1 Rate</th>
                                <th>lvl 2 Rate</th>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>5/4</td>
                                <td>5/4</td>
                            </tr>
                            <tr>
                            <td>2</td>
                                <td>5/2</td>
                                <td>5/2</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>35/12</td>
                                <td>15/4</td>
                            </tr>

                            <tr>
                                <td>4</td>
                                <td>10/3</td>
                                <td>5</td>
                            </tr>

                            <tr>
                                <td>5</td>
                                <td>10/3</td>
                                <td>65/12</td>
                            </tr>
                            <tr>
                                <td>6</td>
                                <td>10/3</td>
                                <td>35/6</td>
                            </tr>
                            <tr>
                                <td>7</td>
                                <td>10/3</td>
                                <td>25/4</td>
                            </tr>
                            <tr>
                                <td>8</td>
                                <td>10/3</td>
                                <td>20/3</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class = "all_icon_styling tables real hidden">
                    <h3>Real Table</h3>
                    <table>
                        <tbody>
                            <tr>
                                <th>Worker</th>
                                <th>lvl 1 Rate</th>
                                <th>lvl 2 Rate</th>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>1.25</td>
                                <td>1.25</td>
                            </tr>
                            <tr>
                            <td>2</td>
                                <td>2.5</td>
                                <td>2.5</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>2.91<span class="recurring">6</span></td>
                                <td>3.75</td>
                            </tr>

                            <tr>
                                <td>4</td>
                                <td>3.<span class="recurring">3</span></td>
                                <td>5</td>
                            </tr>

                            <tr>
                                <td>5</td>
                                <td>3.<span class="recurring">3</span></td>
                                <td>5.41<span class="recurring">6</span></td>
                            </tr>
                            <tr>
                                <td>6</td>
                                <td>3.<span class="recurring">3</span></td>
                                <td>5.8<span class="recurring">3</span></td>
                            </tr>
                            <tr>
                                <td>7</td>
                                <td>3.<span class="recurring">3</span></td>
                                <td>6.25</td>
                            </tr>
                            <tr>
                                <td>8</td>
                                <td>3.<span class="recurring">3</span></td>
                                <td>6.<span class="recurring">6</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class = "all_icon_styling tables hidden">
                    <h2>Explanation: <p class=alloy_colour>Workers mine 5 alloy per 4 or 6 seconds (based on # of workers using a node). If 0 workers on the node - next worker mines 5 alloy per 4 seconds. If there is 1 worker, next worker mines at 5 alloy / 6 seconds.</p></h2>
                </div>

                <div class = "all_icon_styling description hidden">
                    <h2>What is the GroveHeart? <p class = "alloy_colour">The Groveheart is an ARU base. It allows the production of workers and is used in the ARU tech tree. Additionally, The GroveHeart can be upgraded for better mining and into a GodHeart for more health and more tech tree unlocks. Base buildings can produce workers and receive minerals from workers. Aru Buildings also produce Rootway in a radius from the centre of the building. It is a very important building and if you lose all your base type structures you will LOSE the game.</p></h2>
                </div>

                <div class = "all_icon_styling description hidden">
                    <h2>Fan Lore: <p class = "alloy_colour">The GroveHeart contains the very essence of what it means to be of Aru. Pools of sacrifical blood are kept in reserve for the spellcasters as resources are stocked high by the ever-hard working symbiotes. The building itself - alive and breathing, having come from a mystical tree holds many deep and terrible secrets.</p></h2>
                </div>

                <div class = "all_icon_styling">
                    <h2>Other:</h2>
                    <button>Mining Info</button>
                    <button>Description</button> 
                    <button class="selected">Home</button> 
                </div>

            </div>
        </div>
                `
    }

    iconToolTip.innerHTML = tooltip_content;

    if(iconName === "all_icon"){
        let navigation = document.querySelectorAll(".icon_tooltip button");
        let selected = document.querySelector(".icon_tooltip button.selected")
        navigation.forEach((page)=>{
            page.addEventListener("click", ()=> {
                if(page!==selected){
                    selected.classList.remove("selected");
                    page.classList.add("selected");
                    selected = page;
                }

                let hide =[".description", ".home"];
                let show = ".tables";

                if(selected.innerHTML === "Description"){
                    hide = [".tables", ".home"];
                    show = ".description";
                }
                if(selected.innerHTML === "Home"){
                    hide = [".tables", ".description"];
                    show = ".home"
                }

                if(selected.innerHTML === "Mining Info"){
                    hide =[".description", ".home"];
                    show = ".tables";                   
                }

                document.querySelectorAll(".icon_tooltip "+show).forEach((element)=>{element.classList.remove("hidden")});
                document.querySelectorAll(".icon_tooltip "+hide[0]).forEach((element)=>{element.classList.add("hidden")});
                document.querySelectorAll(".icon_tooltip "+hide[1]).forEach((element)=>{element.classList.add("hidden")});
                
            })

        });
    }
}

createTooltips();