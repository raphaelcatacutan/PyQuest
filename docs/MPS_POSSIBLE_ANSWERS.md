# Machine Problem Possible Answers

This document lists the accepted canonical answer for every machine problem.

## Validation Notes

- Validation checks runtime behavior: player output must match each problem's expected output.
- Different implementations are accepted as long as they run without runtime errors and produce the expected output.
- For explicit arithmetic prompts (for example, "Add 50 and 25"), validation also checks that the intended operator and operands are present in the code.
- The canonical answer below is a reference solution, not the only accepted solution.
- If a problem has no expected output configured, fallback validation compares normalized code.

## Scene: forest

### forest-01

Problem:
Print the message 'Exploring the Forest' to the console.

Accepted canonical answer:
```python
print('Exploring the Forest')
```

### forest-02

Problem:
Create a variable named 'trees' and assign it the value 100. Print the variable.

Accepted canonical answer:
```python
trees = 100
print(trees)
```

### forest-03

Problem:
Assign the string 'Oak' to a variable called 'tree_type' and print it.

Accepted canonical answer:
```python
tree_type = 'Oak'
print(tree_type)
```

### forest-04

Problem:
Add 50 and 25 and print the result.

Accepted canonical answer:
```python
print(50 + 25)
```

### forest-05

Problem:
Subtract 10 from 100 and print the result.

Accepted canonical answer:
```python
print(100 - 10)
```

### forest-06

Problem:
Multiply 12 by 12 and print the result.

Accepted canonical answer:
```python
print(12 * 12)
```

### forest-07

Problem:
Divide 10 by 4 and print the result (should be a float).

Accepted canonical answer:
```python
print(10 / 4)
```

### forest-08

Problem:
Use the modulo operator (%) to find the remainder of 10 divided by 3.

Accepted canonical answer:
```python
print(10 % 3)
```

### forest-09

Problem:
Calculate 2 to the power of 3 (2 cubed) and print the result.

Accepted canonical answer:
```python
print(2 ** 3)
```

### forest-10

Problem:
Create a variable 'gold' with 50. Increase it by 10 using += and print it.

Accepted canonical answer:
```python
gold = 50
gold += 10
print(gold)
```

### forest-11

Problem:
Print the value of (5 + 10).

Accepted canonical answer:
```python
print(5 + 10)
```

### forest-12

Problem:
Calculate the average of 10, 20, and 30 and print the result.

Accepted canonical answer:
```python
print((10 + 20 + 30) / 3)
```

### forest-13

Problem:
Print the message 'Forest camp ready'.

Accepted canonical answer:
```python
print('Forest camp ready')
```

### forest-14

Problem:
Create a variable named 'hp' with value 75 and print it.

Accepted canonical answer:
```python
hp = 75
print(hp)
```

### forest-15

Problem:
Create a variable named 'mana' with value 30 and print it.

Accepted canonical answer:
```python
mana = 30
print(mana)
```

### forest-16

Problem:
Assign the string 'Scout' to variable 'class_name' and print it.

Accepted canonical answer:
```python
class_name = 'Scout'
print(class_name)
```

### forest-17

Problem:
Create a boolean variable 'is_night' set to False and print it.

Accepted canonical answer:
```python
is_night = False
print(is_night)
```

### forest-18

Problem:
Create a float variable 'accuracy' set to 0.95 and print it.

Accepted canonical answer:
```python
accuracy = 0.95
print(accuracy)
```

### forest-19

Problem:
Add 18 and 27, then print the result.

Accepted canonical answer:
```python
print(18 + 27)
```

### forest-20

Problem:
Subtract 47 from 150 and print the result.

Accepted canonical answer:
```python
print(150 - 47)
```

### forest-21

Problem:
Multiply 9 by 8 and print the result.

Accepted canonical answer:
```python
print(9 * 8)
```

### forest-22

Problem:
Divide 21 by 6 and print the result as float.

Accepted canonical answer:
```python
print(21 / 6)
```

### forest-23

Problem:
Use division for 21 and 6, then print the result.

Accepted canonical answer:
```python
print(21 / 6)
```

### forest-24

Problem:
Use modulo to get the remainder of 22 divided by 5.

Accepted canonical answer:
```python
print(22 % 5)
```

### forest-25

Problem:
Compute 3 to the power of 4 and print the result.

Accepted canonical answer:
```python
print(3 ** 4)
```

### forest-26

Problem:
Use parentheses to compute (4 + 6) * 3 and print it.

Accepted canonical answer:
```python
print((4 + 6) * 3)
```

### forest-27

Problem:
Set stamina to 30, increase it by 15 using +=, then print it.

Accepted canonical answer:
```python
stamina = 30
stamina += 15
print(stamina)
```

### forest-28

Problem:
Set arrows to 20, decrease it by 6 using -=, then print it.

Accepted canonical answer:
```python
arrows = 20
arrows -= 6
print(arrows)
```

### forest-29

Problem:
Create variable place='Forest' and print 'Go to ' plus place.

Accepted canonical answer:
```python
place = 'Forest'
print('Go to ' + place)
```

## Scene: swamp

### swamp-01

Problem:
Check if variable 'water_level' (set to 10) is greater than 5. If so, print 'Danger'.

Accepted canonical answer:
```python
water_level = 10
if water_level > 5:
    print('Danger')
```

### swamp-02

Problem:
Set 'temp' to 15. If it is less than 20, print 'Cold'; otherwise, print 'Warm'.

Accepted canonical answer:
```python
temp = 15
if temp < 20:
    print('Cold')
else:
    print('Warm')
```

### swamp-03

Problem:
Use elif: if 'score' is 90 print 'A', if 80 print 'B', else print 'C'. Set score to 85.

Accepted canonical answer:
```python
score = 85
if score >= 90:
    print('A')
elif score >= 80:
    print('B')
else:
    print('C')
```

### swamp-04

Problem:
Use a Match-Case statement to check 'status' set to 404. If 200 print 'OK', if 404 print 'Not Found'.

Accepted canonical answer:
```python
status = 404
match status:
    case 200:
        print('OK')
    case 404:
        print('Not Found')
```

### swamp-05

Problem:
Write a conditional expression (ternary) that assigns 'Yes' to 'result' if 10 > 5, else 'No'. Print 'result'.

Accepted canonical answer:
```python
result = 'Yes' if 10 > 5 else 'No'
print(result)
```

### swamp-06

Problem:
Use the 'and' operator: Print 'Access' if 'has_key' is True and 'knows_pass' is True.

Accepted canonical answer:
```python
has_key = True
knows_pass = True
if has_key and knows_pass:
    print('Access')
```

### swamp-07

Problem:
Use the 'or' operator: Print 'Safe' if 'is_sunny' is True or 'has_umbrella' is True. Set both to True.

Accepted canonical answer:
```python
is_sunny = True
has_umbrella = True
if is_sunny or has_umbrella:
    print('Safe')
```

### swamp-08

Problem:
Use 'not': Set 'is_trapped' to False. If not is_trapped, print 'Free'.

Accepted canonical answer:
```python
is_trapped = False
if not is_trapped:
    print('Free')
```

### swamp-09

Problem:
Create a while loop that prints 'i' from 1 to 3. Start i at 1.

Accepted canonical answer:
```python
i = 1
while i <= 3:
    print(i)
    i += 1
```

### swamp-10

Problem:
Use 'break' in a while loop to stop printing when 'x' equals 3. Start x at 1, loop while x < 10.

Accepted canonical answer:
```python
x = 1
while x < 10:
    if x == 3:
        break
    print(x)
    x += 1
```

### swamp-11

Problem:
Use 'continue' in a while loop to skip printing the number 2. Loop from 1 to 4.

Accepted canonical answer:
```python
i = 0
while i < 4:
    i += 1
    if i == 2:
        continue
    print(i)
```

### swamp-12

Problem:
Check if 'swamp_gas' is not equal (!=) to 'oxygen'. Set gas to 'methane' and print 'True' if they differ.

Accepted canonical answer:
```python
swamp_gas = 'methane'
if swamp_gas != 'oxygen':
    print('True')
```

### swamp-13

Problem:
Loop while 'stamina' > 0. Decrement stamina by 20 each time. Start at 40. Print stamina each loop.

Accepted canonical answer:
```python
stamina = 40
while stamina > 0:
    print(stamina)
    stamina -= 20
```

### swamp-14

Problem:
Use a Match-Case with a wildcard (_) to print 'Unknown' for any direction other than 'North'. Set direction to 'West'.

Accepted canonical answer:
```python
direction = 'West'
match direction:
    case 'North':
        print('Go North')
    case _:
        print('Unknown')
```

### swamp-15

Problem:
Use logical operators: Print 'Win' if 'has_orb' is True and ('level' > 5 or 'is_admin' is True). Set has_orb=True, level=2, is_admin=True.

Accepted canonical answer:
```python
has_orb = True
level = 2
is_admin = True
if has_orb and (level > 5 or is_admin):
    print('Win')
```

### swamp-16

Problem:
Check if 5 is less than or equal to 5 AND 10 is greater than or equal to 8. Print 'Valid'.

Accepted canonical answer:
```python
if 5 <= 5 and 10 >= 8:
    print('Valid')
```

### swamp-17

Problem:
Set 'count' to 5. While count is greater than 0, print 'Live', then break immediately.

Accepted canonical answer:
```python
count = 5
while count > 0:
    print('Live')
    break
```

### swamp-18

Problem:
Combine conditional expression and print: Print 'Small' if 'val' < 10 else 'Big'. Set val to 12.

Accepted canonical answer:
```python
val = 12
print('Small' if val < 10 else 'Big')
```

### swamp-19

Problem:
Loop from 1 to 5. If the number is even, skip it using 'continue'. Print the odd numbers.

Accepted canonical answer:
```python
i = 0
while i < 5:
    i += 1
    if i % 2 == 0:
        continue
    print(i)
```

### swamp-20

Problem:
Use Match-Case: if 'color' is 'Green' or 'Red' print 'Found'. Use '|' for multiple cases. Set color to 'Red'.

Accepted canonical answer:
```python
color = 'Red'
match color:
    case 'Green' | 'Red':
        print('Found')
```

### swamp-21

Problem:
Set water_level to 8. If water_level > 5, print 'High'.

Accepted canonical answer:
```python
water_level = 8
if water_level > 5:
    print('High')
```

### swamp-22

Problem:
Set temp to 22. If temp < 20 print 'Cold', else print 'Warm'.

Accepted canonical answer:
```python
temp = 22
if temp < 20:
    print('Cold')
else:
    print('Warm')
```

### swamp-23

Problem:
Use if/elif/else with score=72: >=90 'A', >=75 'B', otherwise 'C'.

Accepted canonical answer:
```python
score = 72
if score >= 90:
    print('A')
elif score >= 75:
    print('B')
else:
    print('C')
```

### swamp-24

Problem:
Use match-case with weather='rain': case 'sun' print 'Clear', case 'rain' print 'Wet'.

Accepted canonical answer:
```python
weather = 'rain'
match weather:
    case 'sun':
        print('Clear')
    case 'rain':
        print('Wet')
```

### swamp-25

Problem:
Use match-case with wildcard for door='east': print 'Unknown' for non-north values.

Accepted canonical answer:
```python
door = 'east'
match door:
    case 'north':
        print('North')
    case _:
        print('Unknown')
```

### swamp-26

Problem:
Use a conditional expression: set status to 'Low' if energy<50 else 'High'. Set energy=40 and print status.

Accepted canonical answer:
```python
energy = 40
status = 'Low' if energy < 50 else 'High'
print(status)
```

### swamp-27

Problem:
Print 'Pass' if 9 >= 9 else 'Fail' using a ternary expression.

Accepted canonical answer:
```python
print('Pass' if 9 >= 9 else 'Fail')
```

### swamp-28

Problem:
Print the boolean result of 7 == 7.

Accepted canonical answer:
```python
print(7 == 7)
```

### swamp-29

Problem:
If 10 != 3, print 'Different'.

Accepted canonical answer:
```python
if 10 != 3:
    print('Different')
```

### swamp-30

Problem:
Check relational operators: if 5 <= 5 and 8 >= 3, print 'Valid'.

Accepted canonical answer:
```python
if 5 <= 5 and 8 >= 3:
    print('Valid')
```

### swamp-31

Problem:
Use a while loop to print countdown from 3 to 1.

Accepted canonical answer:
```python
c = 3
while c > 0:
    print(c)
    c -= 1
```

### swamp-32

Problem:
Use while + continue to skip number 3 while printing 1 to 5.

Accepted canonical answer:
```python
i = 1
while i <= 5:
    if i == 3:
        i += 1
        continue
    print(i)
    i += 1
```

### swamp-33

Problem:
Use while + break to stop when x is 4. Start at x=1 and print before breaking.

Accepted canonical answer:
```python
x = 1
while x < 10:
    if x == 4:
        break
    print(x)
    x += 1
```

### swamp-34

Problem:
Use logical and: if has_key and has_card are True, print 'Open'.

Accepted canonical answer:
```python
has_key = True
has_card = True
if has_key and has_card:
    print('Open')
```

### swamp-35

Problem:
Use logical or: if hp <= 0 or lives > 0, print 'Retry'. Set hp=0, lives=1.

Accepted canonical answer:
```python
hp = 0
lives = 1
if hp <= 0 or lives > 0:
    print('Retry')
```

### swamp-36

Problem:
Use logical not: set trapped=False and print 'Move' if not trapped.

Accepted canonical answer:
```python
trapped = False
if not trapped:
    print('Move')
```

### swamp-37

Problem:
Use nested if with points=12. If points>10 and points<20, print 'Mid'.

Accepted canonical answer:
```python
points = 12
if points > 10:
    if points < 20:
        print('Mid')
```

### swamp-38

Problem:
Set val=15 and print 'Small' if val<10 else 'Big'.

Accepted canonical answer:
```python
val = 15
print('Small' if val < 10 else 'Big')
```

### swamp-39

Problem:
Use while loop to print odd numbers from 1 to 5 using continue.

Accepted canonical answer:
```python
n = 0
while n < 5:
    n += 1
    if n % 2 == 0:
        continue
    print(n)
```

### swamp-40

Problem:
Use match-case with multiple cases: if color is 'red' or 'blue', print 'Primary'. Set color='blue'.

Accepted canonical answer:
```python
color = 'blue'
match color:
    case 'red' | 'blue':
        print('Primary')
    case _:
        print('Other')
```

## Scene: jungle

### jungle-01

Problem:
Define a function named 'gather_jungle' that prints 'Jungle gathered!' and call it.

Accepted canonical answer:
```python
def gather_jungle():
    print('Jungle gathered!')

gather_jungle()
```

### jungle-02

Problem:
Create a function 'heal' with default argument amount=10 that returns amount. Print heal() and heal(25).

Accepted canonical answer:
```python
def heal(amount=10):
    return amount

print(heal())
print(heal(25))
```

### jungle-03

Problem:
Define function 'craft_badge' that takes 'name' and uses return to produce 'Ranger ' plus name. Print craft_badge('Aria').

Accepted canonical answer:
```python
def craft_badge(name):
    return 'Ranger ' + name

print(craft_badge('Aria'))
```

### jungle-04

Problem:
Use built-in functions len, sum, and max on [2, 3, 7]. Print each result.

Accepted canonical answer:
```python
nums = [2, 3, 7]
print(len(nums))
print(sum(nums))
print(max(nums))
```

### jungle-05

Problem:
Define function 'total_supply' that takes three arguments and returns their sum. Print total_supply(3, 4, 5).

Accepted canonical answer:
```python
def total_supply(a, b, c):
    return a + b + c

print(total_supply(3, 4, 5))
```

### jungle-06

Problem:
Define functions 'add_item' and 'get_total_value'. Call add_item('Potion', 2, 5) which prints a message and returns the total value. Then pass the result to get_total_value which prints and returns it.

Accepted canonical answer:
```python
def add_item(name, qty, value):
    print('Added ' + str(qty) + 'x ' + name + ' to inventory')
    return qty * value

def get_total_value(total):
    print('Total inventory value: ' + str(total) + 'g')
    return total

total = add_item('Potion', 2, 5)
print(get_total_value(total))
```

### jungle-07

Problem:
Define function 'steps' with default argument count=3 and use range(count) to print each step number.

Accepted canonical answer:
```python
def steps(count=3):
    i = 0
    while i < count:
        print(i)
        i += 1

steps()
```

### jungle-08

Problem:
Call built-in type on the result of heal() and print it.

Accepted canonical answer:
```python
def heal(amount=10):
    return amount

print(type(heal()))
```

### jungle-09

Problem:
Define a function named 'announce' that prints 'Jungle start' and call it.

Accepted canonical answer:
```python
def announce():
    print('Jungle start')

announce()
```

### jungle-10

Problem:
Define function 'add' with two parameters and return their sum. Print add(4, 6).

Accepted canonical answer:
```python
def add(a, b):
    return a + b

print(add(4, 6))
```

### jungle-11

Problem:
Create function 'heal' with default argument amount=15 and print heal().

Accepted canonical answer:
```python
def heal(amount=15):
    return amount

print(heal())
```

### jungle-12

Problem:
Use the same heal function but print heal(40).

Accepted canonical answer:
```python
def heal(amount=15):
    return amount

print(heal(40))
```

### jungle-13

Problem:
Define function 'badge' with default name='Ari' and print 'Ranger ' plus name.

Accepted canonical answer:
```python
def badge(name='Ari'):
    print('Ranger ' + name)

badge()
```

### jungle-14

Problem:
Define function 'is_even' that returns True if n is even. Print is_even(8).

Accepted canonical answer:
```python
def is_even(n):
    return n % 2 == 0

print(is_even(8))
```

### jungle-15

Problem:
Define function 'twice' that returns n*2. Store result for 9 and print it.

Accepted canonical answer:
```python
def twice(n):
    return n * 2

result = twice(9)
print(result)
```

### jungle-16

Problem:
Define function 'greet' that returns 'Hi'. Print greet().

Accepted canonical answer:
```python
def greet():
    return 'Hi'

print(greet())
```

### jungle-17

Problem:
Define function total(a, b, c=5) returning a+b+c. Print total(2, 3).

Accepted canonical answer:
```python
def total(a, b, c=5):
    return a + b + c

print(total(2, 3))
```

### jungle-18

Problem:
Use built-in len on the string 'canopy' and print the result.

Accepted canonical answer:
```python
word = 'canopy'
print(len(word))
```

### jungle-19

Problem:
Use built-in sum on [5, 10, 15] and print the result.

Accepted canonical answer:
```python
nums = [5, 10, 15]
print(sum(nums))
```

### jungle-20

Problem:
Use built-ins min and max on [14, 2, 9]. Print min then max.

Accepted canonical answer:
```python
nums = [14, 2, 9]
print(min(nums))
print(max(nums))
```

### jungle-21

Problem:
Define function hp() returning 90. Print the type of hp().

Accepted canonical answer:
```python
def hp():
    return 90

print(type(hp()))
```

### jungle-22

Problem:
Use built-in range to create numbers 1 to 3 and print list(range(1, 4)).

Accepted canonical answer:
```python
print(list(range(1, 4)))
```

### jungle-23

Problem:
Print the message 'Store unlocked' to mark the unlocked store feature.

Accepted canonical answer:
```python
print('Store unlocked')
```

### jungle-24

Problem:
Define function cost(price, tax=2) returning price+tax. Print cost(10).

Accepted canonical answer:
```python
def cost(price, tax=2):
    return price + tax

print(cost(10))
```

### jungle-25

Problem:
Define function combine(a, b) returning a+b. Print combine('Py', 'Quest').

Accepted canonical answer:
```python
def combine(a, b):
    return a + b

print(combine('Py', 'Quest'))
```

### jungle-26

Problem:
Define function call_twice() that prints 'hit' two times, then call it.

Accepted canonical answer:
```python
def call_twice():
    print('hit')
    print('hit')

call_twice()
```

### jungle-27

Problem:
Define function square(n) returning n**2. Print square(7).

Accepted canonical answer:
```python
def square(n):
    return n ** 2

print(square(7))
```

### jungle-28

Problem:
Define function compare(a, b) returning a>b. Print compare(5, 2).

Accepted canonical answer:
```python
def compare(a, b):
    return a > b

print(compare(5, 2))
```

## Scene: temple

### temple-01

Problem:
Use Object-Oriented Programming: create class Adventurer with __init__(name, hp), instantiate hero, and print hero.name.

Accepted canonical answer:
```python
class Adventurer:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

hero = Adventurer('HERO', 120)
print(hero.name)
```

### temple-02

Problem:
Show Inheritance: create class Spear(Weapon) and override attack(self) to return 'Pierce'. Print Spear().attack().

Accepted canonical answer:
```python
class Weapon:
    def attack(self):
        raise NotImplementedError()

class Spear(Weapon):
    def attack(self):
        return 'Pierce'

print(Spear().attack())
```

### temple-03

Problem:
Show Polymorphism: create Weapon base class, Spear and Bow subclasses with attack(), then call and print attack() result for each subclass instance.

Accepted canonical answer:
```python
class Weapon:
    def attack(self):
        raise NotImplementedError()

class Spear(Weapon):
    def attack(self):
        return 'Spear hit'

class Bow(Weapon):
    def attack(self):
        return 'Bow hit'

print(Spear().attack())
print(Bow().attack())
```

### temple-04

Problem:
Demonstrate Encapsulation: create class ShieldedHero with attributes _hp, get_hp(), take_damage(amount), and print final hp after taking 20 from 100.

Accepted canonical answer:
```python
class ShieldedHero:
    def __init__(self, hp):
        self._hp = hp

    def get_hp(self):
        return self._hp

    def take_damage(self, amount):
        self._hp -= amount

h = ShieldedHero(100)
h.take_damage(20)
print(h.get_hp())
```

### temple-05

Problem:
Use super(): create class Guardian(Adventurer) that calls super().__init__(name, hp) and stores shield. Print guardian.shield for value 30.

Accepted canonical answer:
```python
class Adventurer:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

class Guardian(Adventurer):
    def __init__(self, name, hp, shield):
        super().__init__(name, hp)
        self.shield = shield

guardian = Guardian('Lyn', 120, 30)
print(guardian.shield)
```

### temple-06

Problem:
Use Static methods: create class DamageMath with @staticmethod crit(base, bonus) returning base + bonus. Print DamageMath.crit(10, 5).

Accepted canonical answer:
```python
class DamageMath:
    @staticmethod
    def crit(base, bonus):
        return base + bonus

print(DamageMath.crit(10, 5))
```

### temple-07

Problem:
Create class Hero with __init__(name). Make hero named 'Mira' and print hero.name.

Accepted canonical answer:
```python
class Hero:
    def __init__(self, name):
        self.name = name

hero = Hero('Mira')
print(hero.name)
```

### temple-08

Problem:
Show inheritance: class Entity with move() returning 'move', class Knight(Entity), then print Knight().move().

Accepted canonical answer:
```python
class Entity:
    def move(self):
        return 'move'

class Knight(Entity):
    pass

print(Knight().move())
```

### temple-09

Problem:
Show overriding: class Entity.speak returns '...', class Mage overrides speak to return 'spell'. Print Mage().speak().

Accepted canonical answer:
```python
class Entity:
    def speak(self):
        return '...'

class Mage(Entity):
    def speak(self):
        return 'spell'

print(Mage().speak())
```

### temple-10

Problem:
Show polymorphism using attack(): create SpearUser and BowUser classes, then call a function strike(unit) for both.

Accepted canonical answer:
```python
class SpearUser:
    def attack(self):
        return 'stab'

class BowUser:
    def attack(self):
        return 'shot'

def strike(unit):
    print(unit.attack())

strike(SpearUser())
strike(BowUser())
```

### temple-11

Problem:
Demonstrate encapsulation: class Vault with _gold, add(amount), and get(). Add 25 then print get().

Accepted canonical answer:
```python
class Vault:
    def __init__(self):
        self._gold = 0

    def add(self, amount):
        self._gold += amount

    def get(self):
        return self._gold

v = Vault()
v.add(25)
print(v.get())
```

### temple-12

Problem:
Use super(): class Unit(hp), class Tank(Unit) with armor. Create Tank(120, 30) and print hp.

Accepted canonical answer:
```python
class Unit:
    def __init__(self, hp):
        self.hp = hp

class Tank(Unit):
    def __init__(self, hp, armor):
        super().__init__(hp)
        self.armor = armor

t = Tank(120, 30)
print(t.hp)
```

### temple-13

Problem:
Use static method: class Calc with @staticmethod block(x) returning x+5. Print Calc.block(7).

Accepted canonical answer:
```python
class Calc:
    @staticmethod
    def block(x):
        return x + 5

print(Calc.block(7))
```

### temple-14

Problem:
Create class Armor with default defense=10 in __init__. Print defense.

Accepted canonical answer:
```python
class Armor:
    def __init__(self, defense=10):
        self.defense = defense

a = Armor()
print(a.defense)
```

### temple-15

Problem:
Create class Weapon(name, damage). Make Weapon('Spear', 18) and print damage.

Accepted canonical answer:
```python
class Weapon:
    def __init__(self, name, damage):
        self.name = name
        self.damage = damage

w = Weapon('Spear', 18)
print(w.damage)
```

### temple-16

Problem:
Create Parent class with greet() printing 'base'. Create Child(Parent) and call greet().

Accepted canonical answer:
```python
class Parent:
    def greet(self):
        print('base')

class Child(Parent):
    pass

c = Child()
c.greet()
```

### temple-17

Problem:
Create Beast.attack() and override in Wolf to return 'bite'. Print Wolf().attack().

Accepted canonical answer:
```python
class Beast:
    def attack(self):
        return 'claw'

class Wolf(Beast):
    def attack(self):
        return 'bite'

print(Wolf().attack())
```

### temple-18

Problem:
Encapsulation check: class Chest with _locked=True, unlock() sets False, is_locked() returns state. Print state after unlock.

Accepted canonical answer:
```python
class Chest:
    def __init__(self):
        self._locked = True

    def unlock(self):
        self._locked = False

    def is_locked(self):
        return self._locked

c = Chest()
c.unlock()
print(c.is_locked())
```

### temple-19

Problem:
Use super() in subclass Paladin(Character). Store rank and print it.

Accepted canonical answer:
```python
class Character:
    def __init__(self, name):
        self.name = name

class Paladin(Character):
    def __init__(self, name, rank):
        super().__init__(name)
        self.rank = rank

print(Paladin('Lio', 'A').rank)
```

### temple-20

Problem:
Create MathTool with static method add(a, b). Print MathTool.add(3, 9).

Accepted canonical answer:
```python
class MathTool:
    @staticmethod
    def add(a, b):
        return a + b

print(MathTool.add(3, 9))
```

### temple-21

Problem:
Inheritance attribute reuse: Animal sets kind='animal'. Hawk(Animal) inherits it. Print Hawk().kind.

Accepted canonical answer:
```python
class Animal:
    def __init__(self):
        self.kind = 'animal'

class Hawk(Animal):
    pass

print(Hawk().kind)
```

### temple-22

Problem:
Override method and call super: class A.show prints 'A'; class B.show prints A then B. Call B().show().

Accepted canonical answer:
```python
class A:
    def show(self):
        print('A')

class B(A):
    def show(self):
        super().show()
        print('B')

B().show()
```

## Scene: desert

### desert-01

Problem:
Python Data Structure drill: create list items = ['water', 'rope', 'map'] and print items[0].

Accepted canonical answer:
```python
items = ['water', 'rope', 'map']
print(items[0])
```

### desert-02

Problem:
Create a dictionary named 'stats' with hp=100 and energy=40. Access and print stats['hp'].

Accepted canonical answer:
```python
stats = {'hp': 100, 'energy': 40}
print(stats['hp'])
```

### desert-03

Problem:
Create a tuple named 'coords' with values (3, 7, 9) and print coords[1].

Accepted canonical answer:
```python
coords = (3, 7, 9)
print(coords[1])
```

### desert-04

Problem:
Create a set named 'marks' with 'sun', 'sun', 'dune'. Print len(marks).

Accepted canonical answer:
```python
marks = {'sun', 'sun', 'dune'}
print(len(marks))
```

### desert-05

Problem:
Use a For loop to print each item in ['dust', 'stone', 'wind'].

Accepted canonical answer:
```python
for item in ['dust', 'stone', 'wind']:
    print(item)
```

### desert-06

Problem:
Use membership operators: set x = 2 and print x in [1, 2, 3].

Accepted canonical answer:
```python
x = 2
print(x in [1, 2, 3])
```

### desert-07

Problem:
Define function 'total_loot' using *args and return sum(args). Print total_loot(10, 20, 30).

Accepted canonical answer:
```python
def total_loot(*args):
    return sum(args)

print(total_loot(10, 20, 30))
```

### desert-08

Problem:
Define function 'show_stats' using **kwargs. Return kwargs['hp'] and print show_stats(hp=90, energy=30).

Accepted canonical answer:
```python
def show_stats(**kwargs):
    return kwargs['hp']

print(show_stats(hp=90, energy=30))
```

### desert-09

Problem:
Accessing nested data: create party = [{'name': 'Aria', 'gear': ['spear', 'cloak']}] and print party[0]['gear'][1].

Accepted canonical answer:
```python
party = [{'name': 'Aria', 'gear': ['spear', 'cloak']}]
print(party[0]['gear'][1])
```

### desert-10

Problem:
Create list bag=['water', 'rope'], append 'map', and print bag[2].

Accepted canonical answer:
```python
bag = ['water', 'rope']
bag.append('map')
print(bag[2])
```

### desert-11

Problem:
Create list nums=[4, 8, 12] and print the last item.

Accepted canonical answer:
```python
nums = [4, 8, 12]
print(nums[-1])
```

### desert-12

Problem:
Create dictionary stats={'hp': 90}. Add key 'energy'=35 and print stats['energy'].

Accepted canonical answer:
```python
stats = {'hp': 90}
stats['energy'] = 35
print(stats['energy'])
```

### desert-13

Problem:
Create dictionary loot={'coins': 20}. Use get to print loot.get('gems', 0).

Accepted canonical answer:
```python
loot = {'coins': 20}
print(loot.get('gems', 0))
```

### desert-14

Problem:
Create tuple coords=(7, 11, 13) and print len(coords).

Accepted canonical answer:
```python
coords = (7, 11, 13)
print(len(coords))
```

### desert-15

Problem:
Create set marks={'sun', 'sun', 'sand'} and print len(marks).

Accepted canonical answer:
```python
marks = {'sun', 'sun', 'sand'}
print(len(marks))
```

### desert-16

Problem:
Define function total(*args) returning sum(args). Print total(3, 6, 9).

Accepted canonical answer:
```python
def total(*args):
    return sum(args)

print(total(3, 6, 9))
```

### desert-17

Problem:
Define function hero(**kwargs) returning kwargs['name']. Print hero(name='Ari', hp=80).

Accepted canonical answer:
```python
def hero(**kwargs):
    return kwargs['name']

print(hero(name='Ari', hp=80))
```

### desert-18

Problem:
Use a for loop to print each value in tuple (1, 2, 3).

Accepted canonical answer:
```python
for n in (1, 2, 3):
    print(n)
```

### desert-19

Problem:
Use a for loop with range(1, 4) to print squares.

Accepted canonical answer:
```python
for i in range(1, 4):
    print(i * i)
```

### desert-20

Problem:
Access nested data: data={'items': ['orb', 'ring']}. Print the second item.

Accepted canonical answer:
```python
data = {'items': ['orb', 'ring']}
print(data['items'][1])
```

### desert-21

Problem:
Use membership operator: set x=5 and print x in [1, 3, 5].

Accepted canonical answer:
```python
x = 5
print(x in [1, 3, 5])
```

### desert-22

Problem:
Use not in with a set: print 'storm' not in {'sand', 'sun'}.

Accepted canonical answer:
```python
print('storm' not in {'sand', 'sun'})
```

### desert-23

Problem:
Update dictionary: inv={'apple': 2}. Increase inv['apple'] by 3 and print it.

Accepted canonical answer:
```python
inv = {'apple': 2}
inv['apple'] += 3
print(inv['apple'])
```

### desert-24

Problem:
Create list party=[{'name': 'Lyn'}, {'name': 'Kai'}] and print party[1]['name'].

Accepted canonical answer:
```python
party = [{'name': 'Lyn'}, {'name': 'Kai'}]
print(party[1]['name'])
```

### desert-25

Problem:
Unpack tuple pos=(4, 6) into x and y, then print x + y.

Accepted canonical answer:
```python
pos = (4, 6)
x, y = pos
print(x + y)
```

### desert-26

Problem:
Create empty set seen, add 'a' twice, then print len(seen).

Accepted canonical answer:
```python
seen = set()
seen.add('a')
seen.add('a')
print(len(seen))
```

### desert-27

Problem:
Define function top(*args) that returns max(args). Print top(2, 9, 4).

Accepted canonical answer:
```python
def top(*args):
    return max(args)

print(top(2, 9, 4))
```

### desert-28

Problem:
Define function stat(**kwargs) and print kwargs.get('hp', 0) for stat(energy=30).

Accepted canonical answer:
```python
def stat(**kwargs):
    return kwargs.get('hp', 0)

print(stat(energy=30))
```

### desert-29

Problem:
Use membership in a string: print 'a' in 'sand'.

Accepted canonical answer:
```python
print('a' in 'sand')
```

## Scene: cemetery

### cemetery-01

Problem:
Use a try-except block to handle a ZeroDivisionError (10 / 0). Print 'Error' if it occurs.

Accepted canonical answer:
```python
try:
    res = 10 / 0
except ZeroDivisionError:
    print('Error')
```

### cemetery-02

Problem:
Use an f-string to format the float 3.14159 to 2 decimal places. Print the result.

Accepted canonical answer:
```python
pi = 3.14159
print(f'{pi:.2f}')
```

### cemetery-03

Problem:
Cast the string '13' to an integer, add 7 to it, and print the result.

Accepted canonical answer:
```python
val = '13'
print(int(val) + 7)
```

### cemetery-04

Problem:
Access the first character of the string 'Ghost' using indexing and print it.

Accepted canonical answer:
```python
s = 'Ghost'
print(s[0])
```

### cemetery-05

Problem:
Use a string method to convert 'RIP' to lowercase and print it.

Accepted canonical answer:
```python
s = 'RIP'
print(s.lower())
```

### cemetery-06

Problem:
Use indexing to print the last character of 'Skeleton'.

Accepted canonical answer:
```python
s = 'Skeleton'
print(s[-1])
```

### cemetery-07

Problem:
Use the .strip() method to remove spaces from '  spirit  ' and print it.

Accepted canonical answer:
```python
s = '  spirit  '
print(s.strip())
```

### cemetery-08

Problem:
Cast 5.7 to an integer (truncation) and print the result.

Accepted canonical answer:
```python
print(int(5.7))
```

### cemetery-09

Problem:
Use the .replace() method to change 'Zombie' to 'Undead' in the string 'Zombie King'.

Accepted canonical answer:
```python
s = 'Zombie King'
print(s.replace('Zombie', 'Undead'))
```

### cemetery-10

Problem:
Use a try-except-else block. In try, cast '5' to int. If successful, print 'Success' in the else block. If a ValueError occurs, print 'Fail' in except.

Accepted canonical answer:
```python
try:
    x = int('5')
except ValueError:
    print('Fail')
else:
    print('Success')
```

### cemetery-11

Problem:
Format the integer 1000000 with commas as thousands separators using an f-string.

Accepted canonical answer:
```python
num = 1000000
print(f'{num:,}')
```

### cemetery-12

Problem:
Use indexing to print the middle 3 characters of 'Graveyard' (indices 3 to 6).

Accepted canonical answer:
```python
s = 'Graveyard'
print(s[3:6])
```

### cemetery-13

Problem:
Cast a boolean True to a string and print its type.

Accepted canonical answer:
```python
val = str(True)
print(type(val))
```

### cemetery-14

Problem:
Check if 'Bones' starts with 'Bo' using the .startswith() method. Print the boolean result.

Accepted canonical answer:
```python
s = 'Bones'
print(s.startswith('Bo'))
```

### cemetery-15

Problem:
Use a try-except block to handle a ValueError when casting 'Ghost' to int. Print 'Fail'.

Accepted canonical answer:
```python
try:
    int('Ghost')
except ValueError:
    print('Fail')
```

### cemetery-16

Problem:
Format a decimal 0.5 as a percentage '50.0%' using f-strings.

Accepted canonical answer:
```python
val = 0.5
print(f'{val:.1%}')
```

### cemetery-17

Problem:
Use indexing to reverse the string 'Tomb' and print it.

Accepted canonical answer:
```python
s = 'Tomb'
print(s[::-1])
```

### cemetery-18

Problem:
Find the index of the first 'e' in 'Cemetery' using the .find() method.

Accepted canonical answer:
```python
s = 'Cemetery'
print(s.find('e'))
```

### cemetery-19

Problem:
Cast the float 10.0 to a string and concatenate it with ' HP'. Print the result.

Accepted canonical answer:
```python
hp = 10.0
print(str(hp) + ' HP')
```

### cemetery-20

Problem:
Use an f-string to print 'Val: 255' in hexadecimal lowercase (use :x).

Accepted canonical answer:
```python
val = 255
print(f'Val: {val:x}')
```

### cemetery-21

Problem:
Use try-except to catch ValueError when converting 'abc' to int. Print 'Invalid'.

Accepted canonical answer:
```python
try:
    int('abc')
except ValueError:
    print('Invalid')
```

### cemetery-22

Problem:
Use try-except to catch ZeroDivisionError from 7/0. Print 'Zero'.

Accepted canonical answer:
```python
try:
    print(7 / 0)
except ZeroDivisionError:
    print('Zero')
```

### cemetery-23

Problem:
Use try-finally: print 'Start' in try and 'End' in finally.

Accepted canonical answer:
```python
try:
    print('Start')
finally:
    print('End')
```

### cemetery-24

Problem:
Format 12.3456 to 2 decimal places using f-string and print it.

Accepted canonical answer:
```python
value = 12.3456
print(f'{value:.2f}')
```

### cemetery-25

Problem:
Format 0.375 as percentage with one decimal place using f-string.

Accepted canonical answer:
```python
ratio = 0.375
print(f'{ratio:.1%}')
```

### cemetery-26

Problem:
Format integer 9 with leading zeros to width 3 using f-string.

Accepted canonical answer:
```python
num = 9
print(f'{num:03d}')
```

### cemetery-27

Problem:
Cast the string '24' to int, add 6, and print the result.

Accepted canonical answer:
```python
val = '24'
print(int(val) + 6)
```

### cemetery-28

Problem:
Cast '2.5' to float, multiply by 4, and print.

Accepted canonical answer:
```python
num = float('2.5')
print(num * 4)
```

### cemetery-29

Problem:
Cast integer 88 to string and concatenate ' HP'. Print result.

Accepted canonical answer:
```python
hp = 88
print(str(hp) + ' HP')
```

### cemetery-30

Problem:
Cast an empty string to bool and print the result.

Accepted canonical answer:
```python
print(bool(''))
```

### cemetery-31

Problem:
Use string indexing to print the first character of 'crypt'.

Accepted canonical answer:
```python
word = 'crypt'
print(word[0])
```

### cemetery-32

Problem:
Use string indexing to print the last character of 'phantom'.

Accepted canonical answer:
```python
word = 'phantom'
print(word[-1])
```

### cemetery-33

Problem:
Use slicing to print characters index 1 to 4 from 'grave'.

Accepted canonical answer:
```python
word = 'grave'
print(word[1:4])
```

### cemetery-34

Problem:
Convert 'Ritual' to lowercase using a string method and print it.

Accepted canonical answer:
```python
text = 'Ritual'
print(text.lower())
```

### cemetery-35

Problem:
Convert 'shade' to uppercase using string method upper() and print it.

Accepted canonical answer:
```python
text = 'shade'
print(text.upper())
```

### cemetery-36

Problem:
Use strip() to clean '  tomb  ' and print the result.

Accepted canonical answer:
```python
text = '  tomb  '
print(text.strip())
```

### cemetery-37

Problem:
Use replace() to change 'dark' to 'light' in 'dark room'.

Accepted canonical answer:
```python
text = 'dark room'
print(text.replace('dark', 'light'))
```

### cemetery-38

Problem:
Use split() on 'red blue green' and print len(parts).

Accepted canonical answer:
```python
parts = 'red blue green'.split()
print(len(parts))
```

### cemetery-39

Problem:
Use startswith() to check if 'bones' starts with 'bo'. Print the result.

Accepted canonical answer:
```python
text = 'bones'
print(text.startswith('bo'))
```

### cemetery-40

Problem:
Use find() to print the index of first 'e' in 'cemetery'.

Accepted canonical answer:
```python
text = 'cemetery'
print(text.find('e'))
```
