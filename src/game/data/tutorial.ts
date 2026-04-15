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