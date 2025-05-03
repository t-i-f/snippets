'use client'

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useReCaptcha } from "next-recaptcha-v3";
import { FormProvider, useForm, useFormContext, Controller } from "react-hook-form";
import { z } from 'zod';
import axios from 'axios';
import {
  Chip,
  cn,
  Image,
  RadioGroup,
  VisuallyHidden,
  useRadio,
  useRadioGroupContext,
  Button,
  Input,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { YouTubeEmbed } from '@next/third-parties/google';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const schema = z.object({
  access_key: z.string().nonempty(),
  firstName: z.string().nonempty("Please fill out this field."),
  lastName: z.string().nonempty("Please fill out this field."),
  address: z.string().nonempty("Please fill out this field."),
  city: z.string().nonempty("Please fill out this field."),
  color: z.string().nonempty(),
  size: z.string().nonempty(),
  price: z.number(),
  shipping: z.number(),
  phone: z.string().regex(/^03\d{9}$/, {
    message: "Phone number must start with 03 and be 11 digits long",
  }),
});

const handleSubmit = async (data, captcha) => {
  try {
    const response = await axios.post('{{api}}', {data, captcha});
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

const slides = [
  {{#each images}}
    { "src": "{{this}}" },
    {{/each}}
];

// ColorRadioItem component
const ColorRadioItem = React.forwardRef(({ img, value, ...props }, ref) => {
  const { Component, isSelected, isFocusVisible, getBaseProps, getInputProps } = useRadio({ value, ...props });

  return (
      <Component {...getBaseProps()} ref={ref}>
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <span
          className={cn(
            "pointer-events-none h-full w-20 rounded-lg border border-black border-opacity-10 transition-transform group-data-[pressed=true]:scale-90",
            {
              "ring-2 ring-offset-2 ring-offset-content1": isSelected,
              "ring-primary": isSelected || isFocusVisible,
            },
          )}
        >
          <div>
            <Image alt={value} className="h-full w-full" radius="lg" src={img} />
          </div>
          <div className="text-tiny text-center">
            {value}
          </div>
        </span>
      </Component>
  );
});

ColorRadioItem.displayName = "ColorRadioItem";

// TagGroupRadioItem component
const TagGroupRadioItem = React.forwardRef(({ children, ...props }, ref) => {
  const {
    Component,
    isSelected,
    isFocusVisible,
    getBaseProps,
    getInputProps,
    getLabelProps,
  } = useRadio(props);

  const groupContext = useRadioGroupContext();
  const isReadOnly = groupContext.groupState.isReadOnly;
  const size = "lg";

  const colors = {
    bg: "bg-primary",
    fg: "text-primary-foreground",
  };

  return (
    <Component
      {...getBaseProps()}
      ref={ref}
      className={cn(getBaseProps()["className"], {
        "cursor-default": isReadOnly,
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <Chip
        classNames=\{{
          base: cn({
            "outline-none ring-2 ring-focus ring-offset-2 ring-offset-background": isFocusVisible,
            [colors.bg]: isSelected,
          }),
          content: cn("!text-small text-default-400", {
            [colors.fg]: isSelected,
          }),
        }}
        radius="sm"
        size={size}
        variant="flat"
        {...(getLabelProps())}
      >
        {children}
      </Chip>
    </Component>
  );
});

TagGroupRadioItem.displayName = "TagGroupRadioItem";

// ProductViewInfo component
const ProductViewInfo = React.forwardRef(({ className, ...props }, ref) => {
  const [selectedImage, setSelectedImage] = React.useState(-1);
  const { control, watch } = useFormContext();
  const [price, shipping] = watch(["price", "shipping"]);

  return (
    <div className="h-full w-full p-4">
      <div
        ref={ref}
        className={cn(
          "relative flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8",
          className,
        )}
        {...props}
      >
        {/* Product Gallery */}
        <div className="relative h-full w-full flex-none">
          <YouTubeEmbed videoid="{{youtube}}" />
          <Lightbox
            index={selectedImage}
            slides={slides}
            open={selectedImage >= 0}
            close={() => setSelectedImage(-1)}
            controller=\{{ closeOnBackdropClick: true }}
          />
          <div className="mt-4 w-full max-w-full px-2 pb-4 pt-2">
            {slides.map((image, index) => (
              <button
                type="button"
                key={`${image.src}-${index}`}
                className="relative p-1 h-24 w-24 flex-none cursor-pointer items-center justify-center rounded-medium ring-offset-background transition-shadow"
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  removeWrapper
                  alt="Nike Air Max 270"
                  classNames=\{{
                    img: "h-full w-full",
                  }}
                  radius="lg"
                  src={image.src}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight mt-2 sm:mt-0">{{name}}</h1>
          <h2 className="sr-only">Product information</h2>
          <p className="text-xl font-medium tracking-tight">{{currency}}{price}</p>
          <div className="mt-4">
            <p className="sr-only">Product description</p>
            <p className="line-clamp-3 text-medium text-default-500">
              {{description}}
            </p>
          </div>
          <Controller
            name="color"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <RadioGroup
                aria-label="Color"
                classNames=\{{
                  base: "ml-1 mt-6",
                  wrapper: "gap-2",
                }}
                orientation="horizontal"
                onValueChange={onChange}
                onBlur={onBlur}
                value={value}
              >
                {{#each colors}}
                <ColorRadioItem img="{{this.img}}" value="{{this.value}}" />
                {{/each}}
              </RadioGroup>
            )}
          />
          <div className="mt-6 flex flex-col gap-1">
            <div className="mb-4 flex items-center gap-2 text-default-700">
              <Icon icon="carbon:delivery" width={24} />
              <p className="text-small font-medium">{{returns}}</p>
            </div>
            <Controller
              name="size"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <RadioGroup
                  aria-label="Select size"
                  className="gap-1"
                  orientation="horizontal"
                  onValueChange={onChange}
                  onBlur={onBlur}
                  value={value}
                >
                  {{#each sizes}}
                  <TagGroupRadioItem value="{{this.value}}">{{this.value}}</TagGroupRadioItem>
                  {{/each}}
                </RadioGroup>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

ProductViewInfo.displayName = "ProductViewInfo";

// SubmitButton component
const SubmitButton = () => {
  const { watch, formState: {isSubmitting} } = useFormContext();
  const [color, size, price, shipping] = watch(["color", "size", "price", "shipping"]);

  const finalPrice = price + shipping;

  return <Button
    fullWidth
    className="text-medium font-medium"
    color="primary"
    size="lg"
    type="submit"
    isLoading={isSubmitting}
  >
    Order {color}, {size} for {{currency}}{finalPrice}
  </Button>
}

// SingleColumnCheckout component
const SingleColumnCheckout = React.forwardRef(({ className, ...props }, ref) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <section className="flex w-full p-4">
      <div className="w-full">
        <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props}>
          <span className="relative text-foreground-500">Shipping Information</span>
          <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
            <Input
              label="First name*"
              labelPlacement="outside"
              placeholder="Enter your first name"
              variant="flat"
              isInvalid={!!errors.firstName}
              errorMessage={errors.firstName?.message}
              {...register("firstName")}
            />
            <Input
              label="Last name*"
              labelPlacement="outside"
              placeholder="Enter your last name"
              variant="flat"
              isInvalid={!!errors.lastName}
              errorMessage={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
            <Input
              label="Address*"
              labelPlacement="outside"
              placeholder="Lane 1, Street 1"
              variant="flat"
              isInvalid={!!errors.address}
              errorMessage={errors.address?.message}
              {...register("address")}
            />
            <Input
              label="City*"
              labelPlacement="outside"
              placeholder="Enter your city"
              variant="flat"
              isInvalid={!!errors.city}
              errorMessage={errors.city?.message}
              {...register("city")}
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap">
            <Input
              label="Postal code"
              labelPlacement="outside"
              placeholder="12345"
              variant="flat"
              {...register("zip")}
            />
            <Input
              label="Phone number*"
              labelPlacement="outside"
              placeholder="03349876543"
              variant="flat"
              isInvalid={!!errors.phone}
              errorMessage={errors.phone?.message}
              {...register("phone")}
            />
          </div>
          <Input
            label="Additional Information"
            labelPlacement="outside"
            placeholder="Instructions or other details"
            variant="flat"
            {...register("instructions")}
          />

          <div className="mt-2 flex gap-2">
            <SubmitButton/>
          </div>
        </div>
      </div>
    </section>
  );
});

SingleColumnCheckout.displayName = "SingleColumnCheckout";

// Main component
export default function Home() {
  const { executeRecaptcha } = useReCaptcha();
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      access_key: "{{slug}}",
      color: "{{colors.0.value}}",
      size: "{{sizes.0.value}}",
      price: {{price}},
      shipping: 200,
    }
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(async (data) => {
          const captcha = await executeRecaptcha("form_submit");
          await handleSubmit(data, captcha)
        })}
        className="w-screen min-h-screen flex items-center justify-center flex-col lg:flex-row"
      >
        <ProductViewInfo />
        <SingleColumnCheckout />
      </form>
    </FormProvider>
  );
} 