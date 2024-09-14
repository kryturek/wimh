"use client";
// components/Breathwork.js

import { useState, useEffect } from "react";
import * as Tone from "tone";

const Breathwork = () => {
	const [phase, setPhase] = useState("prepare"); // 'prepare', 'charging', 'exercise', 'inhale', 'done'
	const [timeLeft, setTimeLeft] = useState(3); // Countdown for prepare or inhale phase
	const [exerciseTime, setExerciseTime] = useState(0); // Time counter for breath-hold
	const [breathsLeft, setBreathsLeft] = useState(30); // Counter for charging phase (30 breaths)
	const [rounds, setRounds] = useState(0); // Track rounds completed

	useEffect(() => {
		let timer;

		// Handle the countdown for prepare and inhale phases
		if (phase === "prepare" || phase === "inhale") {
			if (timeLeft > 0) {
				playBeep();
				timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000); // Countdown
			} else if (phase === "prepare") {
				startChargingPhase(); // Switch to charging phase
			} else if (phase === "inhale") {
				startNextRound(); // After inhale, move to the next round
			}
		} else if (phase === "charging") {
			// Handle the charging breaths
			if (breathsLeft > 0) {
				playBreathSound();
				timer = setTimeout(() => setBreathsLeft(breathsLeft - 1), 3000); // Each breath takes 3 seconds
			} else {
				startExercisePhase(); // Once breaths are complete, start the breath-hold
			}
		} else if (phase === "exercise") {
			// In the breath-hold phase, count the time up
			timer = setTimeout(() => setExerciseTime(exerciseTime + 1), 1000); // Count breath-hold time
		}

		return () => clearTimeout(timer); // Cleanup timer on phase change
	}, [timeLeft, breathsLeft, exerciseTime, phase]);

	// Play a beep sound during the countdown
	const playBeep = () => {
		const synth = new Tone.Synth().toDestination();
		synth.triggerAttackRelease("C4", "8n");
	};

	// Play a sound for each deep breath during the charging phase
	const playBreathSound = () => {
		const synth = new Tone.Synth().toDestination();
		synth.triggerAttackRelease("G4", "8n"); // Different sound for charging breaths
	};

	// Start the charging phase
	const startChargingPhase = () => {
		setPhase("charging");
		setBreathsLeft(30); // Reset the number of breaths to take
	};

	// Start the breath-hold phase
	const startExercisePhase = () => {
		setPhase("exercise");
		setExerciseTime(0); // Start counting breath-hold time
		Tone.start();
		const player = new Tone.Player(
			"path_to_your_background_music.mp3"
		).toDestination();
		player.autostart = true; // Play background music during breath-hold
	};

	const stopBreathHold = () => {
		setPhase("inhale");
		setTimeLeft(15); // Set 15 seconds for the short inhale breath hold
		Tone.Transport.stop(); // Stop background music
	};

	const startNextRound = () => {
		setRounds(rounds + 1); // Increment the round count
		setPhase("prepare");
		setTimeLeft(3); // Start a new round with 3 seconds countdown
	};

	return (
		<div>
			<h1>Wim Hof Breathwork App</h1>
			{phase === "prepare" && <p>Prepare: {timeLeft}</p>}
			{phase === "charging" && <p>Charging: {breathsLeft} breaths left</p>}
			{phase === "exercise" && (
				<>
					<p>Hold Your Breath: {exerciseTime} seconds</p>
					<button onClick={stopBreathHold}>Stop Breath Hold</button>
				</>
			)}
			{phase === "inhale" && <p>Inhale and Hold: {timeLeft} seconds</p>}
			<p>Rounds Completed: {rounds}</p>
		</div>
	);
};

export default Breathwork;
