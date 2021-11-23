import {
	FormGroup,
	ValidationErrors,
	ValidatorFn,
	Validators,
	AbstractControl,
} from "@angular/forms";
import { Renderer2 } from "@angular/core";

export const atLeastOne = (
	validator: ValidatorFn,
	controls: string[] = null,
	renderer: Renderer2
) => (group: FormGroup): ValidationErrors | null => {
	const setControlCss = (
		element: any,
		control: AbstractControl,
		renderer2: Renderer2
	) => {
		/*
		renderer2.setElementClass(element, "ion-untouched", control.untouched);
		renderer2.setElementClass(element, "ion-touched", control.touched);
		renderer2.setElementClass(element, "ion-pristine", control.pristine);
		renderer2.setElementClass(element, "ion-dirty", control.dirty);
		renderer2.setElementClass(element, "ion-valid", control.valid);
		renderer2.setElementClass(element, "ion-invalid", !control.valid);
		*/
	};

	if (!controls) {
		controls = Object.keys(group.controls);
	}

	let hasAtLeastOne = false;
	if (group && group.controls) {
		hasAtLeastOne = controls.some((k) => !validator(group.controls[k]));

		if (!hasAtLeastOne) {
			controls.forEach((key) => {
				group.controls[key].setErrors({ atLeastOne: true });
			});
			controls.forEach((key) => {
				group.controls[key].setErrors({ atLeastOne: true });
			});
		} else {
			controls.forEach((key) => {
				const errors = group.controls[key].errors;

				if (errors != null && errors["atLeastOne"] != null) {
					delete errors["atLeastOne"];
				}

				if (errors == null || Object.keys(errors).length == 0) {
					group.controls[key].setErrors(null);
				} else {
					group.controls[key].setErrors(errors);
				}
			});
		}
		controls.forEach((key) => {
			let ele = document.querySelector('[formControlName="' + key + '"]');
			setControlCss(ele.parentElement, group.controls[key], renderer);
		});
	}

	return hasAtLeastOne
		? null
		: {
				atLeastOne: true,
		  };
};
