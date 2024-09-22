Game.registerMod("extra stats", {
    init: function() {
        Game.Notify('Extra Stats loaded!', '', '', 1, 1);

        this.sessionStartTime = Date.now();

        this.waitForGardenMinigame();

        var originalUpdateMenu = Game.UpdateMenu;

        Game.UpdateMenu = function() {
            originalUpdateMenu();

            if (Game.onMenu == 'stats') {
                var menu = l('menu');

                var elapsedTime = Date.now() - this.sessionStartTime;
                var seconds = Math.floor(elapsedTime / 1000);
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                var days = Math.floor(hours / 24);

                var timeString = "";
                if (days >= 1) {
                    timeString += days + " day" + (days === 1 ? "" : "s");
                    if (hours % 24 > 0) {
                        timeString += ", " + (hours % 24) + " hour" + ((hours % 24) === 1 ? "" : "s");
                    }
                } else if (hours >= 1) {
                    timeString += hours + " hour" + (hours === 1 ? "" : "s");
                    if (minutes % 60 > 0) {
                        timeString += ", " + (minutes % 60) + " minute" + ((minutes % 60) === 1 ? "" : "s");
                    }
                } else if (minutes >= 1) {
                    timeString += minutes + " minute" + (minutes === 1 ? "" : "s");
                } else {
                    timeString += seconds + " second" + (seconds === 1 ? "" : "s");
                }

                function getNextSeason() {
                    var year = new Date().getFullYear();
                    var leap = (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) ? 1 : 0;
                    var day = Math.floor((new Date() - new Date(year, 0, 0)) / (1000 * 60 * 60 * 24));
        
                    var nextSeason = '';
                    var daysUntilNextSeason = 365 + leap - day;
        
                    if (day < 41) {
                        nextSeason = "Valentine's day";
                        daysUntilNextSeason = 41 - day;
                    }
                    else if (day < 90 + leap) {
                        nextSeason = "Business day";
                        daysUntilNextSeason = 90 + leap - day;
                    }
                    else {
                        var easterDay = (function(Y) {
                            var C = Math.floor(Y / 100);
                            var N = Y - 19 * Math.floor(Y / 19);
                            var K = Math.floor((C - 17) / 25);
                            var I = C - Math.floor(C / 4) - Math.floor((C - K) / 3) + 19 * N + 15;
                            I = I - 30 * Math.floor((I / 30));
                            I = I - Math.floor(I / 28) * (1 - Math.floor(I / 28) * Math.floor(29 / (I + 1)) * Math.floor((21 - N) / 11));
                            var J = Y + Math.floor(Y / 4) + I + 2 - C + Math.floor(C / 4);
                            J = J - 7 * Math.floor(J / 7);
                            var L = I - J;
                            var M = 3 + Math.floor((L + 40) / 44);
                            var D = L + 28 - 31 * Math.floor(M / 4);
                            return new Date(Y, M - 1, D);
                        })(year);
        
                        var easterDayOfYear = Math.floor((easterDay - new Date(year, 0, 0)) / (1000 * 60 * 60 * 24));
                        if (day < easterDayOfYear - 7) {
                            nextSeason = 'Easter';
                            daysUntilNextSeason = easterDayOfYear - 7 - day;
                        }
                        else if (day < 297) {
                            nextSeason = 'Halloween';
                            daysUntilNextSeason = 297 - day;
                        }
                        else if (day < 349) {
                            nextSeason = 'Christmas';
                            daysUntilNextSeason = 349 - day;
                        } else {
                            nextSeason = "Valentine's day";
                            daysUntilNextSeason = 365 + leap - day + 41;
                        }
                    }
        
                    return { name: nextSeason, daysUntil: daysUntilNextSeason };
                };

                var nextSeason = getNextSeason();

                function formatDate(epochTime,includeTimeAgo) {
                    var now = new Date();
                    var date = new Date(epochTime);

                    var timeDiff = now - date;
                    
                    var secondsAgo = Math.floor(timeDiff / 1000);
                    var minutesAgo = Math.floor(secondsAgo / 60);
                    var hoursAgo = Math.floor(minutesAgo / 60);
                    var daysAgo = Math.floor(hoursAgo / 24);
                
                    var day = date.getDate();
                    var month = date.getMonth() + 1;
                    var year = date.getFullYear();
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    var ampm = hours >= 12 ? 'PM' : 'AM';
                
                    hours = hours % 12;
                    hours = hours ? hours : 12;
                    minutes = minutes < 10 ? '0' + minutes : minutes;

                    month = month < 10 ? '0' + month : month;
                    day = day < 10 ? '0' + day : day;

                    var formattedDate = `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;

                    var timeAgo;
                    if (daysAgo > 0) {
                        timeAgo = Beautify(daysAgo) + ' day' + (daysAgo === 1 ? "" : "s");
                    } else if (hoursAgo > 0) {
                        timeAgo = (hoursAgo % 24) + ' hour' + ((hoursAgo % 24) === 1 ? "" : "s");
                    } else if (minutesAgo > 0) {
                        timeAgo = (minutesAgo % 60) + ' minute' + ((minutesAgo % 60) === 1 ? "" : "s");
                    } else {
                        timeAgo = secondsAgo % 60 + ' second' + (secondsAgo % 60 === 1 ? "" : "s");
                    }
                    
                    if (includeTimeAgo) {
                        return `${formattedDate} <small>(${timeAgo} ago)</small>`;
                    }else{
                        return `${formattedDate}`;
                    }
                    
                }
                
                var formattedPantheonSwapDate = formatDate(Game.Objects.Temple.minigame.swapT,true);

                function getYearsAgo(date) {
                    const currentDate = new Date();
                    let years = currentDate.getFullYear() - date.getFullYear();
                    let months = currentDate.getMonth() - date.getMonth();
                    
                    if (months < 0) {
                        years--;
                        months += 12;
                    }
                    
                    return { years: years, months: months };
                }
                
                var formattedFullDate = formatDate(Game.fullDate);
                var formattedStartDate = formatDate(Game.startDate);
                
                var yearsSinceFullDate = getYearsAgo(new Date(Game.fullDate));
                var yearsSinceStartDate = getYearsAgo(new Date(Game.startDate));

                var normalWrinklerSucc = 0;
                var shinyWrinklerSucc = 0;
                var totalWrinklerPokes = 0;

                for (var i in Game.wrinklers) {
                    var sucked = Game.wrinklers[i].sucked;
                    var toSuck = 1.1;
                    
                    if (Game.Has('Sacrilegious corruption')) toSuck *= 1.05;
                    if (Game.wrinklers[i].type == 1) toSuck *= 3;

                    sucked *= 1 + Game.auraMult('Dragon Guts') * 0.2;

                    if (Game.Has('Wrinklerspawn')) toSuck *= 1.05;
                    if (Game.hasGod) {
                        var godLvl = Game.hasGod('scorn');
                        if (godLvl == 1) toSuck *= 1.15;
                        else if (godLvl == 2) toSuck *= 1.1;
                        else if (godLvl == 3) toSuck *= 1.05;
                    }

                    var finalSucked = sucked * toSuck;

                    if (Game.wrinklers[i].type == 0) {
                        normalWrinklerSucc += finalSucked;
                    } else if (Game.wrinklers[i].type == 1) {
                        shinyWrinklerSucc += finalSucked;
                    }
                    if (Game.wrinklers[i].phase > 0) {
                        totalWrinklerPokes += Game.wrinklers[i].clicks;
                    }
                }

                function getGoldenCookieMultiplier() {
                    var m = 1;
                
                    if (Game.Has('Lucky day')) m *= 2;
                    if (Game.Has('Serendipity')) m *= 2;
                    if (Game.Has('Golden goose egg')) m /= 0.95;
                    if (Game.Has('Heavenly luck')) m /= 0.95;
                    if (Game.Has('Green yeast digestives')) m /= 0.99;
                    m /= (1 - Game.auraMult('Arcane Aura') * 0.05);
                    if (Game.hasBuff('Sugar blessing')) m /= 0.9;
                
                    if (Game.season == 'easter' && Game.Has('Starspawn')) m /= 0.98;
                    else if (Game.season == 'halloween' && Game.Has('Starterror')) m /= 0.98;
                    else if (Game.season == 'valentines' && Game.Has('Starlove')) m /= 0.98;
                    else if (Game.season == 'fools' && Game.Has('Startrade')) m /= 0.95;
                
                    if (!Game.shimmerTypes['golden'].wrath) m *= Game.eff('goldenCookieFreq');
                    else m *= Game.eff('wrathCookieFreq');
                
                    if (Game.hasGod) {
                        var godLvl = Game.hasGod('industry');
                        if (godLvl == 1) m /= 1.1;
                        else if (godLvl == 2) m /= 1.06;
                        else if (godLvl == 3) m /= 1.03;
                
                        godLvl = Game.hasGod('mother');
                        if (godLvl == 1) m /= 1.15;
                        else if (godLvl == 2) m /= 1.1;
                        else if (godLvl == 3) m /= 1.05;
                
                        if (Game.season != '') {
                            godLvl = Game.hasGod('seasons');
                            if (Game.season != 'fools') {
                                if (godLvl == 1) m /= 0.97;
                                else if (godLvl == 2) m /= 0.98;
                                else if (godLvl == 3) m /= 0.99;
                            } else {
                                if (godLvl == 1) m /= 0.955;
                                else if (godLvl == 2) m /= 0.97;
                                else if (godLvl == 3) m /= 0.985;
                            }
                        }
                    }
                
                    if (Game.shimmerTypes['golden'].chain > 0) m = 20; 
                    if (Game.Has('Gold hoard')) m = 100;
                
                    return m;
                }

                var goldenCookieMultiplier = getGoldenCookieMultiplier();
                
                var extraStatsTitle = '<div class="title">Extra Stats</div>';
                var newStats = '<div class="listing"><b>Session started:</b> ' + timeString + ' ago</div>' +
                                '<div class="listing"><b>Missed golden cookie clicks:</b> ' + Beautify(Game.missedGoldenClicks) + '</div>';

                if (goldenCookieMultiplier!=1) {
                    newStats += '<div class="listing"><b>Golden cookie spawn multiplier:</b> <small>x</small>' + Beautify(goldenCookieMultiplier, 2) + '</div>';
                }

                if (Game.Objects.Farm.minigame.convertTimes > 0 && Game.ascensionMode!=1) {
                    newStats += '<div class="listing"><b>Garden sacrifices:</b> ' + Beautify(Game.Objects.Farm.minigame.convertTimes) + '</div>';
                }
                
                if (Game.Objects['Temple'].level > 0 && Game.ascensionMode!=1) {
                    newStats += '<div class="listing"><b>Last pantheon swap time:</b> ' + formattedPantheonSwapDate + '</div>';
                }
                
                if (Game.Upgrades['One mind'].unlocked) {
                    if (Game.elderWrath!=0) {
                        newStats += '<div class="listing"><b>Cookies swallowed by wrinklers:</b> ' + Beautify(normalWrinklerSucc) + '</div>';
                    }
                    
                    if (shinyWrinklerSucc > 0) {
                        newStats += '<div class="listing"><b>Cookies swallowed by shiny wrinklers:</b> ' + Beautify(shinyWrinklerSucc) + '</div>';
                    }
                
                    newStats += '<div class="listing warning"><b>Cookies withered by wrinklers:</b> ' + Beautify(Game.cookiesSucked) + '</div>';
                    if (Game.elderWrath!=0 && totalWrinklerPokes>0) {
                        newStats += '<div class="listing"><b>Wrinkler pokes:</b> ' + Beautify(totalWrinklerPokes) + '</div>';
                    }
                }

                if (Game.TickerClicks>0) {
                    newStats += '<div class="listing"><b>News ticker clicks:</b> ' + Beautify(Game.TickerClicks) + '</div>';
                }

                if (Game.Upgrades['Fortune cookies'].unlocked && Game.ascensionMode!=1) {
                    newStats += '<div class="listing"><b>Golden cookie fortune triggered:</b> ' + (Game.fortuneGC ? 'False' : 'True') + '</div>' +
                                '<div class="listing"><b>1-hour cps fortune triggered:</b> ' + (Game.fortuneCPS ? 'False' : 'True') + '</div>';
                }

                if (Game.Achievements["Uncanny clicker"].won) {
                    newStats += '<div class="listing"><b>Uncanny clicker triggered:</b> ' + (Game.autoclickerDetected ? 'True' : 'False') + '</div>';
                }

                newStats += '<div class="listing"><b>Next seasonal event:</b> ' + nextSeason.name + ' <small>(in ' + nextSeason.daysUntil + ' days)</small></div>';

                if (Game.resets > 0) {
                    newStats += '<div class="listing"><b>Legacy start time:</b> ' + formattedFullDate;
                    
                    if (yearsSinceFullDate.years >= 1) {
                        newStats += ' <small>(over ' + yearsSinceFullDate.years + ' year';
                        if (yearsSinceFullDate.years != 1) {
                            newStats += 's';
                        }
                        if (yearsSinceFullDate.months > 0) {
                            newStats += ' and ' + yearsSinceFullDate.months + ' month';
                            if (yearsSinceFullDate.months != 1) {
                                newStats += 's';
                            }
                        }
                        newStats += ' ago)</small>';
                    } else if (yearsSinceFullDate.months >= 1) {
                        newStats += ' <small>(' + yearsSinceFullDate.months + ' month';
                        if (yearsSinceFullDate.months != 1) {
                            newStats += 's';
                        }
                        newStats += ' ago)</small>';
                    }
                    
                    newStats += '</div>';
                }
                
                newStats += '<div class="listing"><b>Run start time:</b> ' + formattedStartDate;
                
                if (yearsSinceStartDate.years >= 1) {
                    newStats += ' <small>(over ' + yearsSinceStartDate.years + ' year';
                    if (yearsSinceStartDate.years != 1) {
                        newStats += 's';
                    }
                    if (yearsSinceStartDate.months > 0) {
                        newStats += ' and ' + yearsSinceStartDate.months + ' month';
                        if (yearsSinceStartDate.months != 1) {
                            newStats += 's';
                        }
                    }
                    newStats += ' ago)</small>';
                } else if (yearsSinceStartDate.months >= 1) {
                    newStats += ' <small>(' + yearsSinceStartDate.months + ' month';
                    if (yearsSinceStartDate.months != 1) {
                        newStats += 's';
                    }
                    newStats += ' ago)</small>';
                }
                
                newStats += '</div>' +
                            '<div class="listing"><b>Run seed:</b> ' + Game.seed + '</div>';

                if (Game.useLocalStorage) {
                    newStats += '<div class="listing"><b>Save file size:</b> ' + Beautify(localStorageGet(Game.SaveTo).length) + ' bytes</div>';
                }else{
                    let saveData = document.cookie.split('; ').find(row => row.startsWith(Game.SaveTo + '='));
                    if (saveData) {
                        saveData = saveData.split('=')[1];
                        newStats += '<div class="listing"><b>Save file size:</b> ' + Beautify(unescape(saveData).length) + ' bytes</div>';
                    }
                }
                                
                var brmoment = false;
                var totalBuildingsBought = 0;
                var totalBuildingsSold = 0;
                var buildings = ['Cursor', 'Grandma', 'Farm', 'Mine', 'Factory', 'Bank', 'Temple', 'Wizard tower', 'Shipment', 'Alchemy lab', 'Portal', 'Time machine', 'Antimatter condenser', 'Prism', 'Chancemaker', 'Fractal engine', 'Javascript console', 'Idleverse', 'Cortex baker', 'You'];
                
                for (var i = 0; i < buildings.length; i++) {
                    var building = buildings[i];
                    var buildingObj = Game.Objects[building];
                
                    var buildingsSold = buildingObj.bought - buildingObj.amount;
                    if (buildingsSold > 0) {
                        totalBuildingsSold += buildingsSold;
                    }

                    if (buildingObj.bought > 0) {
                        if (brmoment == false) {
                            brmoment = true;
                            newStats += '<br>';
                        }
                    }
                }

                if (brmoment == true) {
                    newStats += '<div class="listing"><b>Buildings sold:</b> ' + Beautify(totalBuildingsSold) + '</div>';
                }
                
                for (var i = 0; i < buildings.length; i++) {
                    var building = buildings[i];
                    var buildingObj = Game.Objects[building];

                    if (buildingObj.bought > 0) {
                        var buildingName = (building !== "Factory" && building !== "You") ? building + 's' : (building === "Factory" ? "Factories" : "You");
                        newStats += '<div class="listing"><b>' + buildingName + ' bought:</b> ' + Beautify(buildingObj.bought) + 
                                    ' <small>(highest: ' + Beautify(buildingObj.highest) + ')</small></div>';
                    }
                }

                if (!menu.innerHTML.includes('Extra Stats')) {
                    var sections = menu.getElementsByClassName('subsection');
                    if (sections.length > 0) {
                        var firstSection = sections[0];
                        firstSection.insertAdjacentHTML('afterend', '<div class="subsection">' + extraStatsTitle + newStats + '</div>');
                    } else {
                        menu.innerHTML += '<div class="subsection">' + extraStatsTitle + newStats + '</div>';
                    }
                } else {
                    var statsDiv = menu.querySelector('.subsection');
                    statsDiv.innerHTML = extraStatsTitle + newStats;
                }
            }
        }.bind(this);
    },

    waitForGardenMinigame: function() {
        const checkInterval = setInterval(() => {
            if (Game.Objects['Farm'] && Game.Objects['Farm'].minigame) {
                const str = `'<b>'+loc("Stage:")+'</b> '+loc(["bud","sprout","bloom","mature"][stage-1])+'<br>'+`;
                const edstr = `'<b>'+loc("Stage:")+'</b> '+loc(["bud","sprout","bloom","mature"][stage-1])+'<br><small>Age: '+Beautify(M.plot[y][x][1])+'%</small></br>'+`;

                eval('Game.Objects.Farm.minigame.tileTooltip='+Game.Objects.Farm.minigame.tileTooltip.toString().replace('{',"{M=Game.Objects.Farm.minigame;").replace(str,edstr));

                clearInterval(checkInterval);
            }
        }, 1000);
    }
});