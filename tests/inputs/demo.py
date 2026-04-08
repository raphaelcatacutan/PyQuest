# from builtin import * this shouldn't be required

from user.weapons import spear

class CustomAttack:
    def attack1():
        pass

goTo("village") # this is from builtin, no imports needed
print("Buy")

spear.attack() 
spear.thrust()


# all other python files in the future should be supported automatically