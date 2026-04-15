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
				'p3-class-definition',
				'Checkpoint: Define the Adventurer class before continuing.',
				['class\\s+Adventurer\\s*:'],
				'Create class Adventurer: in your code to continue.',
			),
		},
		{
			afterIndex: 4,
			step: createRegexTestStep(
				'p3-init-method',
				'Checkpoint: Add __init__ with self.name and self.hp before continuing.',
				['def\\s+__init__\\s*\\(\\s*self\\s*,\\s*name\\s*,\\s*hp\\s*\\)', 'self\\.name\\s*=\\s*name', 'self\\.hp\\s*=\\s*hp'],
				'Define __init__(self, name, hp) and assign both self.name and self.hp.',
			),
		},
		{
			afterIndex: 6,
			step: createRegexTestStep(
				'p3-object-instantiation',
				'Checkpoint: Instantiate hero and print hero.name before continuing.',
				['hero\\s*=\\s*Adventurer\\s*\\(', 'print\\s*\\(\\s*hero\\.name\\s*\\)'],
				"Create hero = Adventurer('Aria', 100) and print(hero.name).",
			),
		},
		{
			afterIndex: 9,
			step: createRegexTestStep(
				'p3-method-call',
				'Checkpoint: Define attack(self) and call hero.attack().',
				['def\\s+attack\\s*\\(\\s*self\\s*\\)', 'hero\\.attack\\s*\\('],
				'Add attack(self) to a class and call hero.attack() in your code.',
			),
		},
		{
			afterIndex: 11,
			step: createRegexTestStep(
				'p3-inheritance',
				'Checkpoint: Create Ranger inheritance before continuing.',
				['class\\s+Ranger\\s*\\(\\s*Adventurer\\s*\\)\\s*:'],
				'Define class Ranger(Adventurer): to continue.',
			),
		},
		{
			afterIndex: 18,
			step: createRegexTestStep(
				'p3-state-update',
				'Checkpoint: Add take_damage and update hero hp before continuing.',
				['def\\s+take_damage\\s*\\(\\s*self\\s*,\\s*amount\\s*\\)', 'hero\\.take_damage\\s*\\(', 'print\\s*\\(\\s*hero\\.hp\\s*\\)'],
				'Add take_damage(self, amount), call hero.take_damage(...), and print(hero.hp).',
			),
		},
	],
	'phase-4': [
		{
			afterIndex: 2,
			step: createRegexTestStep(
				'p4-from-import',
				'Checkpoint: Import spear from user.weapons before continuing.',
				['from\\s+user\\.weapons\\s+import\\s+spear'],
				'Use from user.weapons import spear to continue.',
			),
		},
		{
			afterIndex: 4,
			step: createRegexTestStep(
				'p4-spear-attack-call',
				'Checkpoint: Call spear.attack() before continuing.',
				['spear\\.attack\\s*\\('],
				'Call spear.attack() in your code to continue.',
			),
		},
		{
			afterIndex: 6,
			step: createRegexTestStep(
				'p4-module-alias-import',
				'Checkpoint: Import user.weapons with an alias before continuing.',
				['import\\s+user\\.weapons\\s+as\\s+[A-Za-z_][A-Za-z0-9_]*'],
				'Use import user.weapons as <alias> to continue.',
			),
		},
		{
			afterIndex: 7,
			step: createRegexTestStep(
				'p4-module-alias-call',
				'Checkpoint: Use your module alias to call a spear method.',
				['[A-Za-z_][A-Za-z0-9_]*\\.spear\\.thrust\\s*\\('],
				'Call <alias>.spear.thrust() in your code to continue.',
			),
		},
		{
			afterIndex: 14,
			step: createRegexTestStep(
				'p4-import-loop-combo',
				'Checkpoint: Combine import usage with a loop before continuing.',
				['from\\s+user\\.weapons\\s+import\\s+spear', 'for\\s+_\\s+in\\s+range\\s*\\(', 'spear\\.attack\\s*\\('],
				'Write an import + for loop that calls spear.attack().',
			),
		},
	],
	'phase-5': [
		{
			afterIndex: 2,
			step: createRegexTestStep(
				'p5-list-append',
				'Checkpoint: Create inventory list, append, and print it.',
				['inventory\\s*=\\s*\\[', 'inventory\\.append\\s*\\(', 'print\\s*\\(\\s*inventory\\s*\\)'],
				'Create inventory list, append at least one item, and print(inventory).',
			),
		},
		{
			afterIndex: 4,
			step: createRegexTestStep(
				'p5-dictionary-access',
				'Checkpoint: Create stats dictionary and access a key.',
				['stats\\s*=\\s*\\{', 'stats\\s*\\[\\s*["\']hp["\']\\s*\\]'],
				'Create stats dictionary and reference stats[\'hp\'] in code.',
			),
		},
		{
			afterIndex: 6,
			step: createRegexTestStep(
				'p5-tuple-index',
				'Checkpoint: Create tuple coords and access coords[0].',
				['coords\\s*=\\s*\\(', 'coords\\s*\\[\\s*0\\s*\\]'],
				'Create coords tuple and access coords[0] before continuing.',
			),
		},
		{
			afterIndex: 8,
			step: createRegexTestStep(
				'p5-set-usage',
				'Checkpoint: Create a set named tags and print it.',
				['tags\\s*=\\s*\\{', 'print\\s*\\(\\s*tags\\s*\\)'],
				'Create tags set and print(tags) to continue.',
			),
		},
		{
			afterIndex: 10,
			step: createRegexTestStep(
				'p5-loop-over-list',
				'Checkpoint: Loop over inventory and print each item.',
				['for\\s+item\\s+in\\s+inventory\\s*:', 'print\\s*\\(\\s*item\\s*\\)'],
				'Write for item in inventory: and print(item).',
			),
		},
		{
			afterIndex: 11,
			step: createRegexTestStep(
				'p5-list-comprehension',
				'Checkpoint: Build a list comprehension and print the result.',
				['squares\\s*=\\s*\\[\\s*[^\\]]+\\s+for\\s+[^\\]]+\\]', 'print\\s*\\(\\s*squares\\s*\\)'],
				'Create a list comprehension for squares and print(squares).',
			),
		},
		{
			afterIndex: 12,
			step: createRegexTestStep(
				'p5-nested-structure',
				'Checkpoint: Create nested party structure and access name.',
				['party\\s*=\\s*\\[', 'party\\s*\\[\\s*0\\s*\\]\\s*\\[\\s*["\']name["\']\\s*\\]'],
				'Create party list of dictionaries and access party[0][\'name\'] in code.',
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