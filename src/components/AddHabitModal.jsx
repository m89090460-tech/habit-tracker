import { useState } from "react";
import { ICONS, COLORS, CATEGORIES, WEEKDAYS } from "../lib/constants";
import { THEME } from "../lib/theme";
import { ArrowLeft } from "lucide-react";
import { fetchIdentities } from "../lib/identityApi";

function AddHabitModal({
	onClose,
	onSave,
	initial,
	identities = [],
	t = THEME.dark,
}) {
	const isEditing = Boolean(initial);

	const [name, setName] = useState(initial?.name ?? "");
	const [target, setTarget] = useState(initial?.target ?? 1);
	const [unit, setUnit] = useState(initial?.unit ?? "marta");
	const [icon, setIcon] = useState(initial?.icon ?? "target");
	const [color, setColor] = useState(initial?.color ?? "violet");
	const [category, setCategory] = useState(initial?.category ?? "Boshqa");
	const [days, setDays] = useState(initial?.days ?? WEEKDAYS.map((d) => d.key));
	const [reminderTime, setReminderTime] = useState(initial?.reminderTime ?? "");
	const [location, setLocation] = useState(initial?.location ?? "");
	const [durationMinutes, setDurationMinutes] = useState(
		initial?.durationMinutes ?? 0,
	);
	const [stackAfter, setStackAfter] = useState(initial?.stackAfter ?? "");

	const [cue, setCue] = useState(initial?.cue ?? "");
	const [craving, setCraving] = useState(initial?.craving ?? "");
	const [response, setResponse] = useState(initial?.response ?? "");
	const [reward, setReward] = useState(initial?.reward ?? "");

	const [contractText, setContractText] = useState(initial?.contractText ?? "");
	const [contractDeadline, setContractDeadline] = useState(
		initial?.contractDeadline ?? "",
	);
	const [signed, setSigned] = useState(Boolean(initial?.contractSignedAt));
	const [identityId, setIdentityId] = useState(initial?.identityId ?? "");
	const isValid = name.trim().length > 0 && days.length > 0;

	const toggleDay = (key) => {
		setDays((prev) =>
			prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key],
		);
	};

	const dayLabels = days
		.map((k) => WEEKDAYS.find((d) => d.key === k)?.label)
		.filter(Boolean)
		.join(", ");

	const intentionSentence =
		dayLabels && (reminderTime || location || durationMinutes)
			? `Kelasi hafta men ${dayLabels} kunlari${reminderTime ? `, soat ${reminderTime}da` : ""}${
					location ? `, ${location}da` : ""
				}${durationMinutes ? `, ${durationMinutes} daqiqa` : ""} "${name || "..."}" bilan shug'ullanaman.`
			: "";

	const autoContract = () => {
		if (!name) return;
		setContractText(
			`Men, ushbu foydalanuvchi, "${name}" odatini${
				contractDeadline ? ` ${contractDeadline}gacha` : ""
			} izchil bajarishga va'da beraman. Agar buni buzsam, o'zimga ma'lum bir oqibat (masalan, sevimli mashg'ulotimdan voz kechish) qo'llayman.`,
		);
	};

	const handleSubmit = () => {
		if (!isValid) return;
		onSave({
			id: initial?.id ?? Date.now().toString(),
			name,
			target: Number(target) || 1,
			unit,
			icon,
			color,
			category,
			days,
			reminderTime,
			location,
			durationMinutes: Number(durationMinutes) || 0,
			stackAfter,
			trigger: intentionSentence,
			cue,
			craving,
			response,
			reward,
			contractText,
			contractDeadline: contractDeadline || null,
			contractSignedAt: signed ? new Date().toISOString() : null,
			identityId: identityId || null,
			current: initial?.current ?? 0,
		});
	};

	const ActiveIcon = ICONS[icon];
	const activeColor = COLORS[color];
	const inputClass = `w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-violet-500 ${t.input} ${t.strong}`;
	const labelClass = `text-xs mb-1.5 block ${t.sub}`;

	return (
		<div>
			<button
				onClick={onClose}
				className={`flex items-center gap-1.5 text-xs font-medium mb-4 ${t.sub} hover:${t.strong}`}>
				<ArrowLeft size={14} /> Orqaga
			</button>

			<h2 className={`text-lg sm:text-xl font-semibold mb-5 ${t.strong}`}>
				{isEditing ? "Odatni tahrirlash" : "Yangi odat"}
			</h2>

			<div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">
				{/* CHAP USTUN — asosiy ma'lumot */}
				<div
					className={`rounded-[24px] border p-5 sm:p-6 mb-6 lg:mb-0 ${t.card}`}>
					<div
						className={`flex items-center gap-3 rounded-2xl border p-3 mb-5 ${t.track} ${t.border}`}>
						<div
							className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
							style={{ background: activeColor.soft }}>
							<ActiveIcon size={18} style={{ color: activeColor.ring }} />
						</div>
						<div className="min-w-0">
							<p className={`text-sm font-medium truncate ${t.strong}`}>
								{name || "Odat nomi shu yerda ko'rinadi"}
							</p>
							<p className={`text-[11px] ${t.muted}`}>
								Maqsad: {target || 1} {unit}
							</p>
						</div>
					</div>

					<label className={labelClass}>Odat nomi</label>
					<input
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Masalan: Kitob o'qish"
						className={`${inputClass} mb-4`}
					/>

					<div className="grid grid-cols-2 gap-4 mb-4">
						<div>
							<label className={labelClass}>Maqsad</label>
							<input
								type="number"
								min={1}
								value={target}
								onChange={(e) => setTarget(e.target.value)}
								className={inputClass}
							/>
						</div>
						<div>
							<label className={labelClass}>O'lchov</label>
							<input
								value={unit}
								onChange={(e) => setUnit(e.target.value)}
								className={inputClass}
							/>
						</div>
					</div>

					<label className={labelClass}>Kategoriya</label>
					<div className="flex flex-wrap gap-2 mb-4">
						{identities.length > 0 && (
							<div className="mb-4">
								<label className={labelClass}>
									Qaysi insonga ovoz? (ixtiyoriy)
								</label>
								<div className="flex flex-wrap gap-2">
									{identities.map((idn) => (
										<button
											key={idn.id}
											onClick={() =>
												setIdentityId(identityId === idn.id ? "" : idn.id)
											}
											className={`text-xs rounded-full border px-3 py-1.5 ${
												identityId === idn.id
													? "border-violet-500 bg-violet-500/20 text-violet-300"
													: t.chipInactive
											}`}>
											{idn.name}
										</button>
									))}
								</div>
							</div>
						)}
						{CATEGORIES.map((cat) => (
							<button
								key={cat}
								onClick={() => setCategory(cat)}
								className={`text-xs rounded-full border px-3 py-1.5 ${
									category === cat
										? "border-violet-500 bg-violet-500/20 text-violet-300"
										: t.chipInactive
								}`}>
								{cat}
							</button>
						))}
					</div>

					<label className={labelClass}>Ikonka</label>
					<div className="flex gap-2 mb-4 flex-wrap">
						{Object.entries(ICONS).map(([key, Icon]) => (
							<button
								key={key}
								onClick={() => setIcon(key)}
								className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
									icon === key
										? "border-violet-500 bg-violet-500/20 text-violet-300"
										: t.chipInactive
								}`}>
								<Icon size={16} />
							</button>
						))}
					</div>

					<label className={labelClass}>Rang</label>
					<div className="flex gap-2">
						{Object.entries(COLORS).map(([key, c]) => (
							<button
								key={key}
								onClick={() => setColor(key)}
								className="w-8 h-8 rounded-full border-2"
								style={{
									background: c.ring,
									borderColor:
										color === key
											? t === THEME.light
												? "#0f172a"
												: "#fff"
											: "transparent",
								}}
							/>
						))}
					</div>
				</div>

				{/* O'NG USTUN — Intention, Loop, Contract */}
				<div className="space-y-6">
					<div className={`rounded-[24px] border p-5 sm:p-6 ${t.card}`}>
						<p className={`text-sm font-semibold mb-4 ${t.strong}`}>
							📍 Aniq reja (Implementation Intention)
						</p>

						<label className={labelClass}>Qaysi kunlari?</label>
						<div className="flex gap-1.5 mb-3">
							{WEEKDAYS.map((d) => (
								<button
									key={d.key}
									onClick={() => toggleDay(d.key)}
									className={`flex-1 text-[11px] rounded-lg py-2 border transition-colors ${
										days.includes(d.key)
											? "border-violet-500 bg-violet-500/20 text-violet-300"
											: t.chipInactive
									}`}>
									{d.label}
								</button>
							))}
						</div>

						<div className="grid grid-cols-2 gap-3 mb-3">
							<div>
								<label className={labelClass}>Soat</label>
								<input
									type="time"
									value={reminderTime}
									onChange={(e) => setReminderTime(e.target.value)}
									className={inputClass}
								/>
							</div>
							<div>
								<label className={labelClass}>Davomiyligi (daq.)</label>
								<input
									type="number"
									min={0}
									value={durationMinutes}
									onChange={(e) => setDurationMinutes(e.target.value)}
									className={inputClass}
								/>
							</div>
						</div>

						<label className={labelClass}>Joy</label>
						<input
							value={location}
							onChange={(e) => setLocation(e.target.value)}
							placeholder="Masalan: Oshxonada"
							className={`${inputClass} mb-3`}
						/>

						<label className={labelClass}>
							Qaysi odatdan keyin? (ixtiyoriy)
						</label>
						<input
							value={stackAfter}
							onChange={(e) => setStackAfter(e.target.value)}
							placeholder="Masalan: Tishimni yuvgandan keyin"
							className={inputClass}
						/>

						{intentionSentence && (
							<p className={`text-[11px] mt-3 italic ${t.muted}`}>
								💬 "{intentionSentence}"
							</p>
						)}
					</div>

					<div className={`rounded-[24px] border p-5 sm:p-6 ${t.card}`}>
						<p className={`text-sm font-semibold mb-4 ${t.strong}`}>
							🔁 Odat sikli (Signal → Istak → Javob → Mukofot)
						</p>
						<label className={labelClass}>
							Signal (Cue) — nima ishga tushiradi?
						</label>
						<input
							value={cue}
							onChange={(e) => setCue(e.target.value)}
							placeholder="Masalan: Uyg'onib, soatga qarayman"
							className={`${inputClass} mb-3`}
						/>
						<label className={labelClass}>
							Istak (Craving) — nimani xohlayman?
						</label>
						<input
							value={craving}
							onChange={(e) => setCraving(e.target.value)}
							placeholder="Masalan: Kuchli va sog'lom his qilishni"
							className={`${inputClass} mb-3`}
						/>
						<label className={labelClass}>
							Javob (Response) — nima qilaman?
						</label>
						<input
							value={response}
							onChange={(e) => setResponse(e.target.value)}
							placeholder="Masalan: 20 daqiqa yuguraman"
							className={`${inputClass} mb-3`}
						/>
						<label className={labelClass}>
							Mukofot (Reward) — o'zimni qanday mukofotlayman?
						</label>
						<input
							value={reward}
							onChange={(e) => setReward(e.target.value)}
							placeholder="Masalan: Sevimli qahva ichaman"
							className={inputClass}
						/>
					</div>

					<div className={`rounded-[24px] border p-5 sm:p-6 ${t.card}`}>
						<div className="flex items-center justify-between mb-4">
							<p className={`text-sm font-semibold ${t.strong}`}>
								📜 Odat shartnomasi
							</p>
							<button
								onClick={autoContract}
								className="text-[11px] text-violet-400 hover:text-violet-300">
								Avtomatik yozish
							</button>
						</div>
						<textarea
							value={contractText}
							onChange={(e) => setContractText(e.target.value)}
							rows={3}
							placeholder={`Men, "..." odatini bajarishga va'da beraman...`}
							className={`${inputClass} mb-3 resize-none`}
						/>
						<label className={labelClass}>Muddat</label>
						<input
							type="date"
							value={contractDeadline}
							onChange={(e) => setContractDeadline(e.target.value)}
							className={`${inputClass} mb-3`}
						/>
						<label className="flex items-center gap-2 text-xs cursor-pointer">
							<input
								type="checkbox"
								checked={signed}
								onChange={(e) => setSigned(e.target.checked)}
								className="w-4 h-4 accent-violet-600"
							/>
							<span className={t.strong}>
								Men shu shartnomaga rioya qilishga va'da beraman
							</span>
						</label>
					</div>
				</div>
			</div>

			<button
				onClick={handleSubmit}
				disabled={!isValid}
				className="w-full max-w-md mx-auto lg:mx-0 mt-6 block rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#5A2EE6] text-white text-sm font-semibold py-3.5 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity">
				{isEditing ? "Saqlash" : "Odatni qo'shish"}
			</button>
		</div>
	);
}

export default AddHabitModal;
