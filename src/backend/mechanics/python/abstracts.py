class Armor:
    type: str
    durability: float

class Item:
    name: str
    quantity: int
    cooldown: int
    
    def __init__(self):
        pass

class Entity: 
    health: float
    name: str
    id: str

class Player:
    energy: int
    armor: Armor  
    
    def equip(item: Item):
        pass

    def unequip():
        pass

class Enemy(Entity):
    pass

class Slime(Enemy):
    pass

class Spear(Item):
    def __init__(self):
        pass
    def attack(self):
        pass
    def thrust(self):
        pass

    def pierce(self):
        pass
    