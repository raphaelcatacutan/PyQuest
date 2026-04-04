class Spear:
    """A spear weapon with damage and durability"""
    
    def __init__(self, damage=10, durability=100):
        self.damage = damage
        self.durability = durability
        self.name = "Iron Spear"
    
    def attack(self, target_name="Enemy"):
        """Attack a target with the spear"""
        if self.durability <= 0:
            return f"{self.name} is broken!"
        
        self.durability -= 5
        actual_damage = self.damage
        
        print(f"Attacked {target_name} with {self.name} for {actual_damage} damage!")
        print(f"Spear durability: {self.durability}/100")
        
        return actual_damage
    
    def thrust(self, target_name="Enemy"):
        """Powerful thrust attack that deals extra damage but costs more durability"""
        if self.durability <= 0:
            return f"{self.name} is broken!"
        
        self.durability -= 15
        actual_damage = int(self.damage * 1.5)
        
        print(f"Thrust attack on {target_name} for {actual_damage} damage!")
        print(f"Spear durability: {self.durability}/100")
        
        return actual_damage
    
    def repair(self, amount=50):
        """Repair the spear"""
        self.durability = min(100, self.durability + amount)
        print(f"Repaired {self.name}. Durability: {self.durability}/100")