import { Duration } from "open-utilities/core/datetime/mod.js";
import { Timer } from "open-utilities/web/async/mod.js";
import {} from "helion/core.js";
import {} from "helion/LightTheme.js";
import {} from "helion/OutlinedTextField.js";
import {} from "helion/FilledButton.js";
import {} from "helion/CircleButton.js";
import "./main.css";
import { fa5_brands_github, fa5_solid_copy, fa5_solid_home } from "fontawesome-svgs";

document.body.innerHTML = /*html*/ `
<div class="App helion-fill-parent">
	<h1>Universal Time</h1>
	<p>Timezone: <span id=timezoneName></span></p>
	<div class=inputContainer>
		<input id=timeInput type="datetime-local" class="helion-outlined-text-field" />
		<!-- <button id=timeInput_toggle></button> -->
	</div>

	<p id=durationFromNow></p>

	<br />
	<hr />
	<br />

	<p>Share Time</p>
	<div class=inputContainer>
		<input id=urlShare type="url" class="helion-outlined-text-field">
		<button id=urlShare_copy class="helion-filled-button" title="Copy">${fa5_solid_copy}</button>
	</div>

	<div class="App_ActionButtons">
		<a class="helion-circle-button" href="https://github.com/TheCymaera/universal-time" target="_blank">
			${fa5_brands_github}
		</a>
		<a class="helion-circle-button" href="/">
			${fa5_solid_home}
		</a>
	</div>
</div>`;

// data
let dateTime = new Date();
const url = new URL(location.href);
if (url.searchParams.has("epochMilliseconds")) {
	dateTime = new Date(parseInt(url.searchParams.get("epochMilliseconds")!));
}

// time zone
document.querySelector("#timezoneName")!.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;

// duration
const durationFromNowText = document.querySelector("#durationFromNow") as HTMLElement;
const updateDurationText = ()=>{
	const diff = new Duration({ milliseconds: dateTime.getTime() - Date.now() });
	const absDiff = diff.clone().abs();
	const suffix = (diff.milliseconds > 0 ? "from now" : "ago");
	durationFromNowText.textContent = `${absDiff.daysPart}d ${absDiff.hoursPart}h ${absDiff.minutesPart}m ${absDiff.secondsPart}s ${suffix}`;
}
Timer.periodic(new Duration({ seconds: .5 }), updateDurationText);
updateDurationText();

// url share
const urlShareInput = document.querySelector("#urlShare") as HTMLInputElement;
urlShareInput.onfocus = ()=>urlShareInput.select();
document.querySelector("#urlShare_copy")!.addEventListener("click", ()=>{
	navigator.clipboard.writeText(urlShareInput.value);
});
const updateURLShare = ()=>{
	urlShareInput.value = url.origin + url.pathname + "?epochMilliseconds=" + dateTime.getTime();
}
updateURLShare();

// input
const timeInput = document.querySelector("#timeInput") as HTMLInputElement;
{
	const now = new Date(dateTime);
	now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
	timeInput.value = now.toISOString().slice(0,16);
};
timeInput.onchange = ()=>{
	if (!timeInput.value) return;
	dateTime = new Date(timeInput.value);
	updateURLShare();
	updateDurationText();
};
