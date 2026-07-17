"use client";

import { useEffect } from "react";
import { Controller, useForm, useWatch, type Control, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { addressSchema, type AddressInput } from "@/schemas/address.schema";
import { useAddress, useUpsertAddress } from "@/hooks/useAddress";
import { useCountries, useStates, useCities } from "@/hooks/useLocations";
import { getApiErrorMessage } from "@/lib/apiError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader } from "@/components/shared/Loader";

function LocationSelect({
  label,
  value,
  onChange,
  options,
  disabled,
  placeholder,
  error,
}: {
  label: string;
  value?: number;
  onChange: (id: number) => void;
  options: { id: number; label: string }[];
  disabled?: boolean;
  placeholder: string;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select
        value={value ? String(value) : undefined}
        onValueChange={(v) => v && onChange(Number(v))}
        disabled={disabled}
      >
        <SelectTrigger className="w-full" aria-invalid={!!error}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.id} value={String(opt.id)}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

type FieldSet = {
  addressField: "address1" | "address2";
  countryField: "country_id1" | "country_id2";
  stateField: "state_id1" | "state_id2";
  cityField: "city_id1" | "city_id2";
  codeField: "code1" | "code2";
};

// A real component (not an inline Controller render callback) so useStates/
// useCities — which depend on the currently-selected country/state — obey
// the Rules of Hooks instead of being called conditionally mid-render.
function AddressSlot({
  title,
  description,
  control,
  errors,
  fields,
  countries,
}: {
  title: string;
  description: string;
  control: Control<AddressInput>;
  errors: FieldErrors<AddressInput>;
  fields: FieldSet;
  countries: { id: number; country_name: string }[];
}) {
  const { addressField, countryField, stateField, cityField, codeField } = fields;

  const countryId = useWatch({ control, name: countryField });
  const stateId = useWatch({ control, name: stateField });

  const { data: states } = useStates(countryId);
  const { data: cities } = useCities(stateId);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      <Controller
        name={addressField}
        control={control}
        render={({ field }) => (
          <div className="space-y-1.5">
            <Label htmlFor={addressField}>Street address</Label>
            <Input id={addressField} {...field} aria-invalid={!!errors[addressField]} />
            {errors[addressField] && <p className="text-xs text-destructive">{errors[addressField]?.message}</p>}
          </div>
        )}
      />

      <Controller
        name={countryField}
        control={control}
        render={({ field }) => (
          <LocationSelect
            label="Country"
            value={field.value}
            onChange={field.onChange}
            options={countries.map((c) => ({ id: c.id, label: c.country_name }))}
            placeholder="Select country"
            error={errors[countryField]?.message}
          />
        )}
      />

      <div className="grid grid-cols-2 gap-3">
        <Controller
          name={stateField}
          control={control}
          render={({ field }) => (
            <LocationSelect
              label="State / Province"
              value={field.value}
              onChange={field.onChange}
              options={(states ?? []).map((s) => ({ id: s.id, label: s.name }))}
              disabled={!countryId}
              placeholder={countryId ? "Select state" : "Select country first"}
              error={errors[stateField]?.message}
            />
          )}
        />

        <Controller
          name={cityField}
          control={control}
          render={({ field }) => (
            <LocationSelect
              label="City"
              value={field.value}
              onChange={field.onChange}
              options={(cities ?? []).map((c) => ({ id: c.id, label: c.name }))}
              disabled={!stateId}
              placeholder={stateId ? "Select city" : "Select state first"}
              error={errors[cityField]?.message}
            />
          )}
        />
      </div>

      <Controller
        name={codeField}
        control={control}
        render={({ field }) => (
          <div className="space-y-1.5">
            <Label htmlFor={codeField}>Postal code</Label>
            <Input id={codeField} {...field} aria-invalid={!!errors[codeField]} />
            {errors[codeField] && <p className="text-xs text-destructive">{errors[codeField]?.message}</p>}
          </div>
        )}
      />
    </div>
  );
}

const PRIMARY_FIELDS: FieldSet = {
  addressField: "address1",
  countryField: "country_id1",
  stateField: "state_id1",
  cityField: "city_id1",
  codeField: "code1",
};

const SECONDARY_FIELDS: FieldSet = {
  addressField: "address2",
  countryField: "country_id2",
  stateField: "state_id2",
  cityField: "city_id2",
  codeField: "code2",
};

export default function AddressesPage() {
  const { data: address, isLoading } = useAddress();
  const { data: countries } = useCountries();
  const upsertAddress = useUpsertAddress();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressInput>({ resolver: zodResolver(addressSchema) });

  useEffect(() => {
    if (address) {
      reset({
        address1: address.address1,
        country_id1: address.country_id1,
        state_id1: address.state_id1,
        city_id1: address.city_id1,
        code1: address.code1,
        address2: address.address2 ?? "",
        country_id2: address.country_id2 ?? undefined,
        state_id2: address.state_id2 ?? undefined,
        city_id2: address.city_id2 ?? undefined,
        code2: address.code2 ?? "",
      });
    }
  }, [address, reset]);

  const onSubmit = async (values: AddressInput) => {
    if (values.address2 && !(values.country_id2 && values.state_id2 && values.city_id2 && values.code2)) {
      toast.error("Complete all secondary address fields, or leave them all empty");
      return;
    }

    try {
      const payload = {
        ...values,
        address2: values.address2 || undefined,
        country_id2: values.address2 ? values.country_id2 : undefined,
        state_id2: values.address2 ? values.state_id2 : undefined,
        city_id2: values.address2 ? values.city_id2 : undefined,
        code2: values.address2 ? values.code2 : undefined,
      };
      await upsertAddress.mutateAsync(payload);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save address"));
    }
  };

  if (isLoading) return <Loader />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Address Book</CardTitle>
        <CardDescription>Save your address once, reuse it at checkout.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <AddressSlot
            title="Primary address"
            description="Used to pre-fill your shipping details at checkout."
            control={control}
            errors={errors}
            fields={PRIMARY_FIELDS}
            countries={countries ?? []}
          />

          <div className="border-t pt-6">
            <AddressSlot
              title="Secondary address (optional)"
              description="A second address — e.g. work or a family member's home."
              control={control}
              errors={errors}
              fields={SECONDARY_FIELDS}
              countries={countries ?? []}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="h-11 w-full sm:w-auto">
            {isSubmitting ? "Saving..." : "Save address"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
