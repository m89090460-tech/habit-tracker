import { useState, useEffect } from "react";
import { AnimatePresence, Reorder } from "framer-motion";
import { DEFAULT_HABITS } from "./lib/constants";
import { loadState, saveState } from "./lib/storage";
import { THEME } from "./lib/theme";
import { exportScoreCard } from "./lib/exportImage";
import HabitCard from "./components/HabitCard";
import ScoreRing from "./components/ScoreRing";
import AddHabitModal from "./components/AddHabitModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import StatsView from "./components/StatsView";
import Toast from "./components/Toast";
import { Plus, Sun, MoonStar, Download } from "lucide-react";

const todayStr = () => new Date().toISOString().slice(0, 10);
const dayLabel = (dateStr) =>
	["Yak", "Du", "Se", "Chor", "Pay", "Ju", "Sha"][new Date(dateStr).getDay()];

function App() {
	const [habits, setHabits] = useState(DEFAULT_HABITS);
	const [history, setHistory] = useState({});
	const [lastDate, setLastDate] = useState(todayStr());
	const [ready, setReady] = useState(false);

	const [formState, setFormState] = useState(null);
	const [tab, setTab] = useState("today");
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [theme, setTheme] = useState("dark");
	const [toast, setToast] = useState(null);

	useEffect(() => {
		try {
			const saved = loadState();
			if (saved) {
				let h = saved.habits ?? DEFAULT_HABITS;
				let hist = saved.history ?? {};
				let last = saved.lastDate ?? todayStr();
				const today = todayStr();

				if (last !== today) {
					hist = {
						...hist,
						[last]: Object.fromEntries(h.map((x) => [x.id, x.current])),
					};
					h = h.map((x) => ({ ...x, current: 0 }));
					last = today;
				}

				setHabits(h);
				setHistory(hist);
				setLastDate(last);
				if (saved.theme) setTheme(saved.theme);
			}
		} catch (e) {
			setToast("Saqlangan ma'lumotlarni o'qishda xatolik yuz berdi.");
		} finally {
			setReady(true);
		}
	}, []);

	useEffect(() => {
		if (!ready) return;
		const success = saveState({ habits, history, lastDate, theme });
		if (!success) {
			setToast("Ma'lumotlarni saqlashda xatolik yuz berdi.");
		}
	}, [habits, history, lastDate, theme, ready]);

	const bump = (id, delta) => {
		setHabits((prev) =>
			prev.map((h) =>
				h.id === id ? { ...h, current: Math.max(0, h.current + delta) } : h,
			),
		);
	};

	const saveHabit = (habitData) => {
		setHabits((prev) => {
			const exists = prev.some((h) => h.id === habitData.id);
			if (exists) {
				return prev.map((h) => (h.id === habitData.id ? habitData : h));
			}
			return [...prev, habitData];
		});
		setFormState(null);
	};

	const confirmDelete = () => {
		setHabits((prev) => prev.filter((h) => h.id !== deleteTarget.id));
		setDeleteTarget(null);
	};

	const todayScore =
		habits.length === 0
			? 0
			: Math.round(
					(habits.reduce(
						(sum, h) => sum + Math.min(1, h.current / h.target),
						0,
					) /
						habits.length) *
						100,
				);

	const weekData = [];
	for (let i = 6; i >= 0; i--) {
		const d = new Date();
		d.setDate(d.getDate() - i);
		const key = d.toISOString().slice(0, 10);

		let score;
		if (key === todayStr()) {
			score = todayScore;
		} else {
			const snap = history[key];
			if (!snap) {
				score = null;
			} else {
				const ids = Object.keys(snap);
				const relevantHabits = habits.filter((h) => ids.includes(h.id));
				score = relevantHabits.length
					? Math.round(
							(relevantHabits.reduce(
								(sum, h) => sum + Math.min(1, snap[h.id] / h.target),
								0,
							) /
								relevantHabits.length) *
								100,
						)
					: null;
			}
		}
		weekData.push({ key, label: dayLabel(key), score });
	}

	const streak = (() => {
		let count = 0;
		for (let i = weekData.length - 1; i >= 0; i--) {
			const s = weekData[i].score;
			if (s === null) break;
			if (s >= 80) count++;
			else break;
		}
		return count;
	})();

	const t = THEME[theme];
	const completedCount = habits.filter((h) => h.current >= h.target).length;

	if (!ready) {
		return (
			<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">
				Yuklanmoqda...
			</div>
		);
	}

	return (
		<div
			className={`min-h-screen p-4 sm:p-6 lg:p-10 transition-colors ${t.page}`}>
			<AnimatePresence>
				{toast && <Toast message={toast} onClose={() => setToast(null)} />}
			</AnimatePresence>

			<div className="mx-auto max-w-5xl">
				<div className="flex items-center justify-between mb-4 sm:mb-6">
					<h1 className="text-xl sm:text-2xl font-semibold">Habit Tracker</h1>
					<div className="flex items-center gap-2">
						<button
							onClick={() =>
								setTheme((th) => (th === "dark" ? "light" : "dark"))
							}
							className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center ${t.pill}`}>
							{theme === "dark" ? (
								<Sun size={15} className="text-amber-400" />
							) : (
								<MoonStar size={15} className="text-violet-500" />
							)}
						</button>
						<button
							onClick={() => setFormState({})}
							className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium rounded-full px-3 sm:px-4 py-2 sm:py-2.5 transition-colors ${t.accent}`}>
							<Plus size={14} /> Qo'shish
						</button>
					</div>
				</div>

				<div
					className={`flex gap-1 rounded-full border p-1 mb-6 w-fit ${t.pill}`}>
					<button
						onClick={() => setTab("today")}
						className={`text-xs sm:text-sm font-medium rounded-full px-4 py-1.5 sm:py-2 ${
							tab === "today"
								? "bg-gradient-to-r from-[#7C4DFF] to-[#5A2EE6] text-white"
								: t.sub
						}`}>
						Bugun
					</button>
					<button
						onClick={() => setTab("stats")}
						className={`text-xs sm:text-sm font-medium rounded-full px-4 py-1.5 sm:py-2 ${
							tab === "stats"
								? "bg-gradient-to-r from-[#7C4DFF] to-[#5A2EE6] text-white"
								: t.sub
						}`}>
						Statistika
					</button>
				</div>

				{tab === "today" && (
					<div className="lg:grid lg:grid-cols-[380px_1fr] lg:gap-6 lg:items-start">
						<div
							className={`rounded-[24px] border p-5 sm:p-6 mb-6 lg:mb-0 ${t.card}`}>
							<div className="flex items-center gap-5 sm:gap-6 mb-5">
								<ScoreRing score={todayScore} t={t} />
								<div>
									<p className={`text-sm ${t.sub}`}>Bugungi umumiy natija</p>
									<p className={`text-xs mt-1 ${t.muted}`}>
										{completedCount}/{habits.length} odat bajarildi
									</p>
									<p className="text-xs text-amber-400 mt-1">
										🔥 {streak} kunlik streak
									</p>
									<button
										onClick={() =>
											exportScoreCard({
												todayScore,
												streak,
												habits,
												completedCount,
											})
										}
										className={`mt-3 flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1.5 w-fit transition-colors ${t.accent}`}>
										<Download size={13} /> Ulashish
									</button>
								</div>
							</div>

							<div className="flex items-end gap-1.5 sm:gap-2 h-16">
								{weekData.map((d) => (
									<div
										key={d.key}
										className="flex-1 flex flex-col items-center gap-1.5">
										<div
											className={`w-full h-10 rounded-lg flex items-end overflow-hidden ${t.track}`}>
											<div
												className="w-full rounded-lg bg-gradient-to-t from-[#5A2EE6] to-[#7C4DFF]"
												style={{
													height:
														d.score === null
															? "2px"
															: `${Math.max(6, d.score)}%`,
													transition: "height 0.5s ease-out",
												}}
											/>
										</div>
										<span className={`text-[9px] sm:text-[10px] ${t.muted}`}>
											{d.label}
										</span>
									</div>
								))}
							</div>
						</div>

						<div>
							<Reorder.Group axis="y" values={habits} onReorder={setHabits}>
								<AnimatePresence>
									{habits.map((h) => (
										<HabitCard
											key={h.id}
											habit={h}
											t={t}
											onBump={bump}
											onEdit={(habit) => setFormState(habit)}
											onDelete={(habit) => setDeleteTarget(habit)}
										/>
									))}
								</AnimatePresence>
							</Reorder.Group>
							{habits.length === 0 && (
								<div
									className={`text-center py-10 text-sm rounded-[24px] border border-dashed ${t.border} ${t.muted}`}>
									Hali odat qo'shilmagan.
								</div>
							)}
						</div>
					</div>
				)}

				{tab === "stats" && (
					<div className="lg:max-w-2xl">
						<StatsView habits={habits} history={history} t={t} />
					</div>
				)}
			</div>

			{formState !== null && (
				<AddHabitModal
					initial={Object.keys(formState).length ? formState : null}
					onClose={() => setFormState(null)}
					onSave={saveHabit}
					t={t}
				/>
			)}

			{deleteTarget && (
				<DeleteConfirmModal
					habitName={deleteTarget.name}
					onCancel={() => setDeleteTarget(null)}
					onConfirm={confirmDelete}
					t={t}
				/>
			)}
		</div>
	);
}

export default App;
