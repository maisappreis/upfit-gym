type ModelValue = string | number | boolean | null

interface SetupFormProps {
  modelValue?: ModelValue
};

type EmitFn = (event: 'update:modelValue', value: ModelValue) => void

export default function setupFormComponent (
  props: SetupFormProps,
  { emit }: { emit: EmitFn }
) {
  const updateValue = (event: Event) => {
    const target = event.target as HTMLInputElement;
    let val: ModelValue = target.value;

    if (target.type === 'checkbox') {
      val = target.checked;
    }

    if (target.type === 'radio') {
      val = target.value;
    }

    emit('update:modelValue', val);
  }

  return { updateValue };
};
