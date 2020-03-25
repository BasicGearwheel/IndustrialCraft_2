IDRegistry.genItemID("jetpack");
Item.createArmorItem("jetpack", "Jetpack", {name: "electric_jetpack"}, {type: "chestplate", armor: 3, durability: 27, texture: "armor/jetpack_1.png", isTech: true});
ChargeItemRegistry.registerExtraItem(ItemID.jetpack, "Eu", 30000, 100, 1, "armor", true, true);
Item.registerNameOverrideFunction(ItemID.jetpack, ItemName.showItemStorage);

Recipes.addShaped({id: ItemID.jetpack, count: 1, data: 27}, [
	"bcb",
	"bab",
	"d d"
], ['a', BlockID.storageBatBox, -1, 'b', ItemID.casingIron, 0, 'c', ItemID.circuitAdvanced, 0, 'd', 348, 0]);

UIbuttons.setArmorButton(ItemID.jetpack, "button_fly");
UIbuttons.setArmorButton(ItemID.jetpack, "button_hover");

Armor.registerFuncs("jetpack", {
	hurt: function(params, slot, index, maxDamage){
		if(params.type==5){
			var vel = Player.getVelocity().y;
			var time = vel / -0.06;
			var height = 0.06 * time*time / 2;
			if(height < 22){
				if(height < 17){
					var damage = Math.floor(height) - 3;
				} else {
					var damage = Math.ceil(height) - 3;
				}
			}
			//Game.message(height + ", "+damage+", "+params.damage)
			if(damage <= 0 && height < 22){
				Game.prevent();
			}
			else if(params.damage > damage){
				Entity.setHealth(player, Entity.getHealth(player) + params.damage - damage);
			}
		}
		return false;
	},
	tick: function(slot, index, maxDamage){
		var extra = slot.extra;
		var hover = extra? extra.getBoolean("hover") : false;
		if(hover){
			var vel = Player.getVelocity();
			if(vel.y.toFixed(4) == fallVelocity){
				extra.putBoolean("hover", false);
				Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
				Game.message("§4" + Translation.translate("Hover mode disabled"));
			}
			else {
				var energyStored = ChargeItemRegistry.getEnergyStored(slot);
				if(vel.y < -0.1 && energyStored >= 20){
					Player.setVelocity(vel.x, -0.1, vel.z);
					if(World.getThreadTime()%5 == 0){
						ChargeItemRegistry.setEnergyStored(slot, energyStored - 20);
						Player.setArmorSlot(index, slot.id, 1, slot.data, slot.extra);
					}
				}
			}
		}
		return false;
	},
});
