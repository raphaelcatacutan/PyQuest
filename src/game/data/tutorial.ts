import { RawTutorial, Tutorial, TutorialStep, TutorialTest, PhaseType } from '../types/tutorial.types'
import tutorialData from '../json/tutorial.json'

/**
 * 
 *  Tutorial Store
 */

const createRegexTestStep = (
	id: string,
	message: string,
	patterns: string[],
	errorMessage: string,
): TutorialStep => ({
	type: 'test',
	message,
	test: {
		id,
		mode: 'regex-all',
		patterns,
		errorMessage,
	},
})

const checkpointStepsByPhase: Partial<Record<PhaseType, Array<{ afterIndex: number; step: TutorialStep }>>> = {
	'phase-1': [
		{
			afterIndex: 2,
			step: createRegexTestStep(
				'p1-name-variable',
				'Checkpoint: Create a name variable in your editor before continuing.',
				["\\bname\\s*=\\s*['\"][^'\\\"]+['\"]"],
				"You need to assign name first, for example: name = 'Aria'.",
			),
		},
		{
			afterIndex: 4,
			step: createRegexTestStep(
				'p1-role-variable',
				'Checkpoint: Set your role in code before continuing.',
				["\\brole\\s*=\\s*['\"][^'\\\"]+['\"]"],
				"You need to assign role first, for example: role = 'Warrior'.",
			),
		},
		{
			afterIndex: 5,
			step: createRegexTestStep(
				'p1-print-name',
				'Checkpoint: Print your name before continuing.',
				['print\\s*\\(\\s*name\\s*\\)'],
				'Use print(name) in your code to continue.',
			),
		},
		{
			afterIndex: 10,
			step: createRegexTestStep(
				'p1-is-ready',
				'Checkpoint: Prime your spirit with a boolean assignment.',
				['\\bis_ready\\s*=\\s*True\\b'],
				'Set is_ready = True before moving on.',
			),
		},
		{
			afterIndex: 12,
			step: createRegexTestStep(
				'p1-golds-arithmetic',
				'Checkpoint: Add 50 to golds in your code before continuing.',
				['\\bgolds\\s*\\+\\s*50\\b'],
				'Use golds + 50 in your code to continue.',
			),
		},
		{
			afterIndex: 14,
			step: createRegexTestStep(
				'p1-function-usage',
				'Checkpoint: Use one unlocked helper function before continuing.',
				['\\b(goTo\\s*\\(|scavenge\\s*\\()'],
				"Call goTo('Forest') or scavenge() in your code to continue.",
			),
		},
	],
	'phase-2': [
		{
			afterIndex: 3,
			step: createRegexTestStep(
				'p2-while-loop',
				'Checkpoint: Write the while-loop scavenge logic before continuing.',
				['while\\s+energy\\s*>\\s*0\\s*:', '\\bscavenge\\s*\\('],
				'Create a while energy > 0 loop and call scavenge() inside it.',
			),
		},
		{
			afterIndex: 9,
			step: createRegexTestStep(
				'p2-if-tired',
				'Checkpoint: Add the basic if tired logic before continuing.',
				['if\\s+energy\\s*<\\s*20\\s*:', 'print\\s*\\(\\s*["\']Tired["\']\\s*\\)'],
				"Write an if energy < 20 block that prints 'Tired'.",
			),
		},
		{
			afterIndex: 11,
			step: createRegexTestStep(
				'p2-if-else',
				'Checkpoint: Add the if/else branch before continuing.',
				['if\\s+energy\\s*<\\s*20\\s*:', 'else\\s*:', '\\bscavenge\\s*\\('],
				'Add both if and else branches, and call scavenge() in else.',
			),
		},
		{
			afterIndex: 13,
			step: createRegexTestStep(
				'p2-if-elif-else',
				'Checkpoint: Build the full if/elif/else chain before continuing.',
				['if\\s+energy\\s*<\\s*20\\s*:', 'elif\\s+health\\s*<\\s*50\\s*:', 'else\\s*:'],
				'Add if, elif health < 50, and else to continue.',
			),
		},
		{
			afterIndex: 15,
			step: createRegexTestStep(
				'p2-logical-operator',
				'Checkpoint: Use at least one logical operator before continuing.',
				['\\b(and|or|not)\\b'],
				'Use at least one of and/or/not in your code to continue.',
			),
		},
		{
			afterIndex: 17,
			step: createRegexTestStep(
				'p2-def-super-scavenge',
				'Checkpoint: Define super_scavenge() before continuing.',
				['def\\s+super_scavenge\\s*\\(\\s*\\)\\s*:', 'if\\s+energy\\s*>\\s*20\\s*:', '\\bscavenge\\s*\\('],
				'Define super_scavenge() and put conditional scavenge logic inside.',
			),
		},
		{
			afterIndex: 19,
			step: createRegexTestStep(
				'p2-call-super-scavenge',
				'Checkpoint: Call super_scavenge() before continuing.',
				['\\bsuper_scavenge\\s*\\(\\s*\\)'],
				'Call super_scavenge() in your code to continue.',
			),
		},
	],
	'phase-3': [
		{
			afterIndex: 2,
			step: createRegexTestStep(
				'p3-define-gather-function',
				'Checkpoint: Define gather_supplies() so Python learns your reusable ritual.',
				['def\\s+gather_supplies\\s*\\(\\s*\\)\\s*:'],
				'Write def gather_supplies(): with an indented body before continuing.',
			),
		},
		{
			afterIndex: 4,
			step: createRegexTestStep(
				'p3-call-gather-function',
				'Checkpoint: Call gather_supplies() to cast the ritual you just defined.',
				['\\bgather_supplies\\s*\\(\\s*\\)'],
				'Call gather_supplies() so the function actually runs.',
			),
		},
		{
			afterIndex: 7,
			step: createRegexTestStep(
				'p3-default-argument',
				'Checkpoint: Prove default arguments by defining heal(amount=10) and calling it both ways.',
				['def\\s+heal\\s*\\(\\s*amount\\s*=\\s*10\\s*\\)\\s*:', 'print\\s*\\(\\s*heal\\s*\\(\\s*\\)\\s*\\)', 'print\\s*\\(\\s*heal\\s*\\(\\s*25\\s*\\)\\s*\\)'],
				'Define heal(amount=10), then run print(heal()) and print(heal(25)).',
			),
		},
		{
			afterIndex: 9,
			step: createRegexTestStep(
				'p3-return-jump',
				'Checkpoint: Use return inside craft_badge(name) and print the returned value.',
				['def\\s+craft_badge\\s*\\(\\s*name\\s*\\)\\s*:', '\\breturn\\b', 'print\\s*\\(\\s*craft_badge\\s*\\('],
				'Define craft_badge(name), include return, then print(craft_badge(...)).',
			),
		},
		{
			afterIndex: 11,
			step: createRegexTestStep(
				'p3-builtin-functions',
				'Checkpoint: Demonstrate built-ins by using len, sum, and max.',
				['\\blen\\s*\\(', '\\bsum\\s*\\(', '\\bmax\\s*\\('],
				'Use len(...), sum(...), and max(...) to continue.',
			),
		},
		{
			afterIndex: 14,
			step: createRegexTestStep(
				'p3-store-unlock-usage',
				'Checkpoint: Import quartermaster tools and use add_item plus get_total_value.',
				['from\\s+inventory\\s+import\\s+add_item\\s*,\\s*list_items\\s*,\\s*get_total_value', '\\badd_item\\s*\\(', '\\bget_total_value\\s*\\('],
				'Import add_item, list_items, get_total_value from inventory, then call them.',
			),
		},
		{
			afterIndex: 17,
			step: createRegexTestStep(
				'p3-store-wrapper-function',
				'Checkpoint: Wrap store logic into restock(item, qty=1) with a return value.',
				['def\\s+restock\\s*\\(\\s*item\\s*,\\s*qty\\s*=\\s*1\\s*\\)\\s*:', 'return\\s+get_total_value\\s*\\('],
				'Define restock(item, qty=1) and return get_total_value().',
			),
		},
	],
	'phase-4': [
		{
			afterIndex: 2,
			step: createRegexTestStep(
				'p4-adventurer-class',
				'Checkpoint: Build the Adventurer blueprint with an __init__ constructor.',
				['class\\s+Adventurer\\s*:', 'def\\s+__init__\\s*\\(\\s*self\\s*,\\s*name\\s*,\\s*hp\\s*\\)', 'self\\.name\\s*=\\s*name', 'self\\.hp\\s*=\\s*hp'],
				'Define class Adventurer with __init__(self, name, hp), then assign self.name and self.hp.',
			),
		},
		{
			afterIndex: 5,
			step: createRegexTestStep(
				'p4-abstraction',
				'Checkpoint: Create an abstract Weapon contract with attack(self).',
				['class\\s+Weapon\\s*:', 'def\\s+attack\\s*\\(\\s*self\\s*\\)', '(raise\\s+NotImplementedError|pass)'],
				'Define class Weapon with attack(self) and use raise NotImplementedError(...) or pass.',
			),
		},
		{
			afterIndex: 7,
			step: createRegexTestStep(
				'p4-inheritance',
				'Checkpoint: Use inheritance by creating Spear as a subclass of Weapon.',
				['class\\s+Spear\\s*\\(\\s*Weapon\\s*\\)\\s*:', 'def\\s+attack\\s*\\(\\s*self\\s*\\)'],
				'Define class Spear(Weapon) and override attack(self).',
			),
		},
		{
			afterIndex: 8,
			step: createRegexTestStep(
				'p4-polymorphism',
				'Checkpoint: Demonstrate polymorphism by instantiating Spear and calling attack().',
				['\\bw\\s*=\\s*Spear\\s*\\(', 'w\\.attack\\s*\\('],
				'Create w = Spear() and call w.attack() to continue.',
			),
		},
		{
			afterIndex: 10,
			step: createRegexTestStep(
				'p4-encapsulation',
				'Checkpoint: Use encapsulation with internal _hp and a getter.',
				['self\\._hp\\s*=\\s*hp', 'def\\s+get_hp\\s*\\(\\s*self\\s*\\)'],
				'Store hp in self._hp and expose def get_hp(self):.',
			),
		},
		{
			afterIndex: 12,
			step: createRegexTestStep(
				'p4-super-constructor',
				'Checkpoint: Use super() so Guardian reuses Adventurer setup.',
				['class\\s+Guardian\\s*\\(\\s*Adventurer\\s*\\)\\s*:', 'super\\s*\\(\\s*\\)\\s*\\.\\s*__init__\\s*\\('],
				'Define Guardian(Adventurer) and call super().__init__(...) in __init__.',
			),
		},
		{
			afterIndex: 14,
			step: createRegexTestStep(
				'p4-static-method',
				'Checkpoint: Define a static method in DamageMath and call it from the class.',
				['@staticmethod', 'class\\s+DamageMath\\s*:', 'DamageMath\\.crit\\s*\\('],
				'Add @staticmethod to DamageMath.crit and call DamageMath.crit(...).',
			),
		},
		{
			afterIndex: 16,
			step: createRegexTestStep(
				'p4-weapons-armors-unlocked',
				'Checkpoint: Import Player and Spear, then equip Spear on player.',
				['from\\s+abstracts\\s+import\\s+Player\\s*,\\s*Spear', 'player\\s*=\\s*Player\\s*\\(', 'player\\.equip\\s*\\(\\s*Spear\\s*\\('],
				'Import Player and Spear from abstracts, create player, then equip Spear.',
			),
		},
	],
	'phase-5': [
		{
			afterIndex: 2,
			step: createRegexTestStep(
				'p5-list-access',
				'Checkpoint: Create a list and access its first element with index [0].',
				['items\\s*=\\s*\\[', 'items\\s*\\[\\s*0\\s*\\]'],
				'Create items = [...] and access items[0] before continuing.',
			),
		},
		{
			afterIndex: 4,
			step: createRegexTestStep(
				'p5-dictionary-access',
				'Checkpoint: Create a dictionary and retrieve the hp value by key.',
				['stats\\s*=\\s*\\{', 'stats\\s*\\[\\s*["\']hp["\']\\s*\\]'],
				'Create stats = {...} and reference stats[\'hp\'] in code.',
			),
		},
		{
			afterIndex: 6,
			step: createRegexTestStep(
				'p5-tuple-index',
				'Checkpoint: Create a tuple and access its second value with coords[1].',
				['coords\\s*=\\s*\\(', 'coords\\s*\\[\\s*1\\s*\\]'],
				'Create coords tuple and access coords[1] before continuing.',
			),
		},
		{
			afterIndex: 8,
			step: createRegexTestStep(
				'p5-set-usage',
				'Checkpoint: Create a set and print it to observe unique-value behavior.',
				['marks\\s*=\\s*\\{', 'print\\s*\\(\\s*marks\\s*\\)'],
				'Create marks set and print(marks) to continue.',
			),
		},
		{
			afterIndex: 10,
			step: createRegexTestStep(
				'p5-loop-over-items',
				'Checkpoint: Use a for loop to iterate over items and print each one.',
				['for\\s+item\\s+in\\s+items\\s*:', 'print\\s*\\(\\s*item\\s*\\)'],
				'Write for item in items: with an indented print(item).',
			),
		},
		{
			afterIndex: 12,
			step: createRegexTestStep(
				'p5-membership-in',
				'Checkpoint: Use the in operator to test membership in a list.',
				['x\\s*=\\s*2', 'x\\s+in\\s+\\[\\s*1\\s*,\\s*2\\s*,\\s*3\\s*\\]'],
				'Set x = 2 and evaluate x in [1, 2, 3].',
			),
		},
		{
			afterIndex: 14,
			step: createRegexTestStep(
				'p5-membership-not-in',
				'Checkpoint: Use the not in operator for inverse membership checks.',
				['not\\s+in'],
				'Use not in with one of your data structures.',
			),
		},
		{
			afterIndex: 16,
			step: createRegexTestStep(
				'p5-args-function',
				'Checkpoint: Define total_loot(*args), sum the values, and call it.',
				['def\\s+total_loot\\s*\\(\\s*\\*args\\s*\\)\\s*:', 'sum\\s*\\(\\s*args\\s*\\)', 'total_loot\\s*\\('],
				'Define total_loot(*args), use sum(args), and call total_loot(...).',
			),
		},
		{
			afterIndex: 18,
			step: createRegexTestStep(
				'p5-kwargs-function',
				'Checkpoint: Define show_stats(**kwargs) and read hp from keyword data.',
				['def\\s+show_stats\\s*\\(\\s*\\*\\*kwargs\\s*\\)\\s*:', 'kwargs\\s*\\[\\s*["\']hp["\']\\s*\\]', 'show_stats\\s*\\('],
				'Define show_stats(**kwargs), access kwargs[\'hp\'], and call show_stats(...).',
			),
		},
		{
			afterIndex: 20,
			step: createRegexTestStep(
				'p5-nested-accessing',
				'Checkpoint: Access nested list and dictionary data in party.',
				['party\\s*=\\s*\\[', 'party\\s*\\[\\s*0\\s*\\]\\s*\\[\\s*["\']gear["\']\\s*\\]\\s*\\[\\s*1\\s*\\]'],
				'Create party nested data and access party[0][\'gear\'][1].',
			),
		},
	],
	'phase-6': [
		{
			afterIndex: 2,
			step: createRegexTestStep(
				'p6-try-except',
				'Checkpoint: Write a try/except protection block before continuing.',
				['try\\s*:', 'except\\s*:', 'print\\s*\\(\\s*["\']Artifact failed, but I am still standing!["\']\\s*\\)'],
				"Write a try/except block that prints 'Artifact failed, but I am still standing!'.",
			),
		},
		{
			afterIndex: 5,
			step: createRegexTestStep(
				'p6-string-indexing',
				'Checkpoint: Use string indexing with print(name[0]).',
				['print\\s*\\(\\s*name\\s*\\[\\s*0\\s*\\]\\s*\\)'],
				'Use print(name[0]) to continue.',
			),
		},
		{
			afterIndex: 7,
			step: createRegexTestStep(
				'p6-fstring',
				'Checkpoint: Print using an f-string before continuing.',
				['print\\s*\\(\\s*f["\'][^"\']*\\{name\\}[^"\']*\\{age\\}[^"\']*["\']\\s*\\)'],
				'Use print(f"...") with both {name} and {age} to continue.',
			),
		},
		{
			afterIndex: 10,
			step: createRegexTestStep(
				'p6-type-casting',
				'Checkpoint: Use int(1.2) type casting before continuing.',
				['int\\s*\\(\\s*1\\.2\\s*\\)'],
				'Use int(1.2) in your code to continue.',
			),
		},
		{
			afterIndex: 12,
			step: createRegexTestStep(
				'p6-string-method',
				'Checkpoint: Use at least one string method on name before continuing.',
				['name\\.(upper|replace)\\s*\\('],
				'Use name.upper() or name.replace(...) to continue.',
			),
		},
	],
}

const normalizeStep = (rawStep: string | { type?: TutorialStep['type']; message?: string; text?: string; test?: TutorialTest }): TutorialStep => {
	if (typeof rawStep === 'string') {
		return {
			type: 'message',
			message: rawStep,
		}
	}

	return {
		type: rawStep.type ?? 'message',
		message: rawStep.message ?? rawStep.text ?? '',
		test: rawStep.test,
	}
}

const injectCheckpointSteps = (phase: PhaseType, normalizedSteps: TutorialStep[]): TutorialStep[] => {
	const checkpoints = checkpointStepsByPhase[phase] ?? []

	if (checkpoints.length === 0) {
		return normalizedSteps
	}

	const checkpointMap = new Map<number, TutorialStep[]>()
	checkpoints.forEach(({ afterIndex, step }) => {
		const existing = checkpointMap.get(afterIndex) ?? []
		checkpointMap.set(afterIndex, [...existing, step])
	})

	return normalizedSteps.flatMap((step, index) => {
		const additions = checkpointMap.get(index) ?? []
		return [step, ...additions]
	})
}

const normalizedTutorialData: Tutorial[] = (tutorialData as RawTutorial[]).map((phase) => {
	const normalizedSteps = phase.instructions.map((rawStep) => normalizeStep(rawStep))
	return {
		phase: phase.phase,
		instructions: injectCheckpointSteps(phase.phase, normalizedSteps),
	}
})

export const Tutorials: Tutorial[] = normalizedTutorialData