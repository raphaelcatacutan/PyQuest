class Item:
    """Represents an item in the inventory"""
    
    def __init__(self, name, quantity=1, value=0):
        self.name = name
        self.quantity = quantity
        self.value = value
    
    def __str__(self):
        return f"{self.name} x{self.quantity} (Value: {self.value}g)"