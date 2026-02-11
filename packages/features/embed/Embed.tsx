import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";
import classNames from "classnames";
import { usePathname, useRouter } from "next/navigation";
import type { RefObject } from "react";
import { createRef, useRef, useState } from "react";
import type { ControlProps } from "react-select";
import { components } from "react-select";

import { APP_NAME } from "@calcom/lib/constants";
import { useCompatSearchParams } from "@calcom/lib/hooks/useCompatSearchParams";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import {
  Button,
  ColorPicker,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  HorizontalTabs,
  Icon,
  Label,
  Select,
  showToast,
  Switch,
  TextField,
} from "@calcom/ui";

import { getDimension } from "./lib/getDimension";
import type { EmbedTabs, EmbedType, EmbedTypes, PreviewState } from "./types";

const enum Theme {
  auto = "auto",
  light = "light",
  dark = "dark",
}

const queryParamsForDialog = [
  "embedType",
  "embedTabName",
  "embedUrl",
  "eventId",
  "namespace",
  "date",
  "month",
];

function useRouterHelpers() {
  const router = useRouter();
  const searchParams = useCompatSearchParams();
  const pathname = usePathname();

  const goto = (newSearchParams: Record<string, string>) => {
    const newQuery = new URLSearchParams(searchParams ?? undefined);
    Object.keys(newSearchParams).forEach((key) => {
      newQuery.set(key, newSearchParams[key]);
    });

    router.push(`${pathname}?${newQuery.toString()}`);
  };

  const removeQueryParams = (queryParams: string[]) => {
    const params = new URLSearchParams(searchParams ?? undefined);

    queryParams.forEach((param) => {
      params.delete(param);
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  return { goto, removeQueryParams };
}

const ThemeSelectControl = ({ children, ...props }: ControlProps<{ value: Theme; label: string }, false>) => {
  return (
    <components.Control {...props}>
      <Icon name="sun" className="text-subtle mr-2 h-4 w-4" />
      {children}
    </components.Control>
  );
};

const ChooseEmbedTypesDialogContent = ({ types }: { types: EmbedTypes }) => {
  const { t } = useLocale();
  const { goto } = useRouterHelpers();
  return (
    <DialogContent className="rounded-lg p-10" type="creation" size="lg">
      <div className="mb-2">
        <h3 className="font-cal text-emphasis mb-2 text-2xl font-semibold leading-none" id="modal-title">
          {t("how_you_want_add_cal_site", { appName: APP_NAME })}
        </h3>
        <div>
          <p className="text-subtle text-sm">{t("choose_ways_put_cal_site", { appName: APP_NAME })}</p>
        </div>
      </div>
      <div className="items-start space-y-2 md:flex md:space-y-0">
        {types.map((embed, index) => (
          <button
            className="hover:bg-subtle bg-muted	w-full self-stretch rounded-md border border-transparent p-6 text-left transition hover:rounded-md ltr:mr-4 ltr:last:mr-0 rtl:ml-4 rtl:last:ml-0 lg:w-1/3"
            key={index}
            data-testid={embed.type}
            onClick={() => {
              goto({
                embedType: embed.type,
              });
            }}>
            <div className="bg-default order-none box-border flex-none rounded-md border border-solid transition dark:bg-transparent dark:invert">
              {embed.illustration}
            </div>
            <div className="text-emphasis mt-4 font-semibold">{embed.title}</div>
            <p className="text-subtle mt-2 text-sm">{embed.subtitle}</p>
          </button>
        ))}
      </div>
    </DialogContent>
  );
};

const EmbedTypeCodeAndPreviewDialogContent = ({
  embedType,
  embedUrl,
  tabs,
  namespace,
  eventTypeHideOptionDisabled,
  types,
}: {
  embedType: EmbedType;
  embedUrl: string;
  tabs: EmbedTabs;
  namespace: string;
  eventTypeHideOptionDisabled: boolean;
  types: EmbedTypes;
}) => {
  const { t } = useLocale();
  const searchParams = useCompatSearchParams();
  const pathname = usePathname();
  const { goto, removeQueryParams } = useRouterHelpers();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);

  const calLink = decodeURIComponent(embedUrl);

  const s = (href: string) => {
    const _searchParams = new URLSearchParams(searchParams ?? undefined);
    const [a, b] = href.split("=");
    _searchParams.set(a, b);
    return `${pathname?.split("?")[0] ?? ""}?${_searchParams.toString()}`;
  };
  const parsedTabs = tabs.map((t) => ({ ...t, href: s(t.href) }));
  const embedCodeRefs: Record<(typeof tabs)[0]["name"], RefObject<HTMLTextAreaElement>> = {};
  tabs
    .filter((tab) => tab.type === "code")
    .forEach((codeTab) => {
      embedCodeRefs[codeTab.name] = createRef();
    });

  const refOfEmbedCodesRefs = useRef(embedCodeRefs);
  const embed = types.find((embed) => embed.type === embedType);

  const [isEmbedCustomizationOpen, setIsEmbedCustomizationOpen] = useState(true);
  const [isBookingCustomizationOpen, setIsBookingCustomizationOpen] = useState(true);
  const defaultLayout = "month_view";
  const [previewState, setPreviewState] = useState<PreviewState>({
    inline: {
      width: "100%",
      height: "100%",
      config: { layout: defaultLayout },
    } as PreviewState["inline"],
    theme: Theme.auto,
    layout: defaultLayout,
    floatingPopup: {
      config: { layout: defaultLayout },
    } as PreviewState["floatingPopup"],
    elementClick: {
      config: { layout: defaultLayout },
    } as PreviewState["elementClick"],
    hideEventTypeDetails: false,
    palette: {
      brandColor: "#000000",
    },
  });

  const close = () => {
    removeQueryParams(["dialog", ...queryParamsForDialog]);
  };

  // Use embed-code as default tab
  if (!searchParams?.get("embedTabName")) {
    goto({
      embedTabName: "embed-code",
    });
  }

  if (!embed || !embedUrl) {
    close();
    return null;
  }

  const addToPalette = (update: (typeof previewState)["palette"]) => {
    setPreviewState((previewState) => {
      return {
        ...previewState,
        palette: {
          ...previewState.palette,
          ...update,
        },
      };
    });
  };

  const previewInstruction = (instruction: { name: string; arg: unknown }) => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        mode: "cal:preview",
        type: "instruction",
        instruction,
      },
      "*"
    );
  };

  const inlineEmbedDimensionUpdate = ({ width, height }: { width: string; height: string }) => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        mode: "cal:preview",
        type: "inlineEmbedDimensionUpdate",
        data: {
          width: getDimension(width),
          height: getDimension(height),
        },
      },
      "*"
    );
  };

  previewInstruction({
    name: "ui",
    arg: {
      theme: previewState.theme,
      layout: previewState.layout,
      hideEventTypeDetails: previewState.hideEventTypeDetails,
      styles: {
        branding: {
          ...previewState.palette,
        },
      },
    },
  });

  if (embedType === "floating-popup") {
    previewInstruction({
      name: "floatingButton",
      arg: {
        attributes: {
          id: "my-floating-button",
        },
        ...previewState.floatingPopup,
      },
    });
  }

  if (embedType === "inline") {
    inlineEmbedDimensionUpdate({
      width: previewState.inline.width,
      height: previewState.inline.height,
    });
  }

  const ThemeOptions = [
    { value: Theme.auto, label: "Auto" },
    { value: Theme.dark, label: "Dark Theme" },
    { value: Theme.light, label: "Light Theme" },
  ];

  const FloatingPopupPositionOptions = [
    {
      value: "bottom-right" as const,
      label: "Bottom right",
    },
    {
      value: "bottom-left" as const,
      label: "Bottom left",
    },
  ];
  const previewTab = tabs.find((tab) => tab.name === "Preview");

  return (
    <DialogContent
      enableOverflow
      ref={dialogContentRef}
      className="rounded-lg p-0.5 sm:max-w-[80rem]"
      type="creation">
      <div className="flex">
        <div className="bg-muted flex h-[95vh] w-1/3 flex-col overflow-y-auto p-8">
          <h3
            className="text-emphasis mb-2.5 flex items-center text-xl font-semibold leading-5"
            id="modal-title">
            <button
              className="h-6 w-6"
              onClick={() => {
                removeQueryParams(["embedType", "embedTabName"]);
              }}>
              <Icon name="arrow-left" className="mr-4 w-4" />
            </button>
            {embed.title}
          </h3>
          <h4 className="text-subtle mb-6 text-sm font-normal">{embed.subtitle}</h4>
          <div className="flex flex-col">
            <div className={classNames("font-medium", embedType === "element-click" ? "hidden" : "")}>
              <Collapsible
                open={isEmbedCustomizationOpen}
                onOpenChange={() => setIsEmbedCustomizationOpen((val) => !val)}>
                <CollapsibleContent className="text-sm">
                  <div className={classNames(embedType === "inline" ? "block" : "hidden")}>
                    <div className="text-default mb-[9px] text-sm">Window sizing</div>
                    <div className="justify-left mb-6 flex items-center !font-normal ">
                      <div className="mr-[9px]">
                        <TextField
                          labelProps={{ className: "hidden" }}
                          className="focus:ring-offset-0"
                          required
                          value={previewState.inline.width}
                          onChange={(e) => {
                            setPreviewState((previewState) => {
                              const width = e.target.value || "100%";

                              return {
                                ...previewState,
                                inline: {
                                  ...previewState.inline,
                                  width,
                                },
                              };
                            });
                          }}
                          addOnLeading={<>W</>}
                        />
                      </div>

                      <TextField
                        labelProps={{ className: "hidden" }}
                        className="focus:ring-offset-0"
                        value={previewState.inline.height}
                        required
                        onChange={(e) => {
                          const height = e.target.value || "100%";

                          setPreviewState((previewState) => {
                            return {
                              ...previewState,
                              inline: {
                                ...previewState.inline,
                                height,
                              },
                            };
                          });
                        }}
                        addOnLeading={<>H</>}
                      />
                    </div>
                  </div>
                  <div
                    className={classNames(
                      "items-center justify-between",
                      embedType === "floating-popup" ? "text-emphasis" : "hidden"
                    )}>
                    <div className="mb-2 text-sm">Button text</div>
                    <TextField
                      labelProps={{ className: "hidden" }}
                      onChange={(e) => {
                        setPreviewState((previewState) => {
                          return {
                            ...previewState,
                            floatingPopup: {
                              ...previewState.floatingPopup,
                              buttonText: e.target.value,
                            },
                          };
                        });
                      }}
                      defaultValue={t("book_my_cal")}
                      required
                    />
                  </div>
                  <div
                    className={classNames(
                      "mt-4 flex items-center justify-start",
                      embedType === "floating-popup"
                        ? "text-emphasis space-x-2 rtl:space-x-reverse"
                        : "hidden"
                    )}>
                    <Switch
                      defaultChecked={true}
                      onCheckedChange={(checked) => {
                        setPreviewState((previewState) => {
                          return {
                            ...previewState,
                            floatingPopup: {
                              ...previewState.floatingPopup,
                              hideButtonIcon: !checked,
                            },
                          };
                        });
                      }}
                    />
                    <div className="text-default my-2 text-sm">Display calendar icon</div>
                  </div>
                  <div
                    className={classNames(
                      "mt-4 items-center justify-between",
                      embedType === "floating-popup" ? "text-emphasis" : "hidden"
                    )}>
                    <div className="mb-2">Position of button</div>
                    <Select
                      onChange={(position) => {
                        setPreviewState((previewState) => {
                          return {
                            ...previewState,
                            floatingPopup: {
                              ...previewState.floatingPopup,
                              buttonPosition: position?.value,
                            },
                          };
                        });
                      }}
                      defaultValue={FloatingPopupPositionOptions[0]}
                      options={FloatingPopupPositionOptions}
                    />
                  </div>
                  <div className="mt-3 flex flex-col xl:flex-row xl:justify-between">
                    <div className={classNames("mt-4", embedType === "floating-popup" ? "" : "hidden")}>
                      <div className="whitespace-nowrap">Button color</div>
                      <div className="mt-2 w-40 xl:mt-0 xl:w-full">
                        <ColorPicker
                          className="w-[130px]"
                          popoverAlign="start"
                          container={dialogContentRef?.current ?? undefined}
                          defaultValue="#000000"
                          onChange={(color) => {
                            setPreviewState((previewState) => {
                              return {
                                ...previewState,
                                floatingPopup: {
                                  ...previewState.floatingPopup,
                                  buttonColor: color,
                                },
                              };
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className={classNames("mt-4", embedType === "floating-popup" ? "" : "hidden")}>
                      <div className="whitespace-nowrap">Text color</div>
                      <div className="mb-6 mt-2 w-40 xl:mt-0 xl:w-full">
                        <ColorPicker
                          className="w-[130px]"
                          popoverAlign="start"
                          container={dialogContentRef?.current ?? undefined}
                          defaultValue="#000000"
                          onChange={(color) => {
                            setPreviewState((previewState) => {
                              return {
                                ...previewState,
                                floatingPopup: {
                                  ...previewState.floatingPopup,
                                  buttonTextColor: color,
                                },
                              };
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
            <div className="font-medium">
              <Collapsible
                open={isBookingCustomizationOpen}
                onOpenChange={() => setIsBookingCustomizationOpen((val) => !val)}>
                <CollapsibleContent>
                  <div className="text-sm">
                    <Label className="mb-6">
                      <div className="mb-2">Theme</div>
                      <Select
                        className="w-full"
                        defaultValue={ThemeOptions[0]}
                        components={{
                          Control: ThemeSelectControl,
                          IndicatorSeparator: () => null,
                        }}
                        onChange={(option) => {
                          if (!option) {
                            return;
                          }
                          setPreviewState((previewState) => {
                            return {
                              ...previewState,
                              inline: {
                                ...previewState.inline,
                                config: {
                                  ...(previewState.inline.config ?? {}),
                                  theme: option.value,
                                },
                              },
                              floatingPopup: {
                                ...previewState.floatingPopup,
                                config: {
                                  ...(previewState.floatingPopup.config ?? {}),
                                  theme: option.value,
                                },
                              },
                              elementClick: {
                                ...previewState.elementClick,
                                config: {
                                  ...(previewState.elementClick.config ?? {}),
                                  theme: option.value,
                                },
                              },
                              theme: option.value,
                            };
                          });
                        }}
                        options={ThemeOptions}
                      />
                    </Label>
                    {!eventTypeHideOptionDisabled ? (
                      <div className="mb-6 flex items-center justify-start space-x-2 rtl:space-x-reverse">
                        <Switch
                          checked={previewState.hideEventTypeDetails}
                          onCheckedChange={(checked) => {
                            setPreviewState((previewState) => {
                              return {
                                ...previewState,
                                hideEventTypeDetails: checked,
                              };
                            });
                          }}
                        />
                        <div className="text-default text-sm">{t("hide_eventtype_details")}</div>
                      </div>
                    ) : null}
                    {[
                      { name: "brandColor", title: "Brand Color" },
                    ].map((palette) => (
                      <Label key={palette.name} className="mb-6">
                        <div className="mb-2">{palette.title}</div>
                        <div className="w-full">
                          <ColorPicker
                            popoverAlign="start"
                            container={dialogContentRef?.current ?? undefined}
                            defaultValue="#000000"
                            onChange={(color) => {
                              addToPalette({
                                [palette.name as keyof (typeof previewState)["palette"]]: color,
                              });
                            }}
                          />
                        </div>
                      </Label>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>
        <div className="flex h-[95vh] w-2/3 flex-col px-8 pt-8">
          <HorizontalTabs
            data-testid="embed-tabs"
            tabs={parsedTabs.filter((tab) => tab.name !== "Preview")}
            linkShallow
          />
          <>
            <div className="flex h-full flex-col">
              {tabs.map((tab) => {
                if (tab.name === "Preview") return null;
                return (
                  <div
                    key={tab.href}
                    className={classNames(
                      searchParams?.get("embedTabName") === tab.href.split("=")[1] ? "flex-1" : "hidden"
                    )}>
                    {tab.type === "code" && (
                      <tab.Component
                        namespace={namespace}
                        embedType={embedType}
                        calLink={calLink}
                        previewState={previewState}
                        ref={refOfEmbedCodesRefs.current[tab.name]}
                      />
                    )}
                    <div
                      className={
                        searchParams?.get("embedTabName") === "embed-preview" ? "mt-2 block" : "hidden"
                      }
                    />
                  </div>
                );
              })}

              {previewTab && (
                <div className="flex-1">
                  <previewTab.Component
                    namespace={namespace}
                    embedType={embedType}
                    calLink={calLink}
                    previewState={previewState}
                    ref={iframeRef}
                  />
                </div>
              )}
            </div>
            <DialogFooter className="mt-10 flex-row-reverse gap-x-2" showDivider>
              <DialogClose />
              <Button
                type="submit"
                onClick={() => {
                  const currentTabHref = searchParams?.get("embedTabName");
                  const currentTabName = tabs.find(
                    (tab) => tab.href === `embedTabName=${currentTabHref}`
                  )?.name;
                  if (!currentTabName) return;
                  const currentTabCodeEl = refOfEmbedCodesRefs.current[currentTabName].current;
                  if (!currentTabCodeEl) {
                    return;
                  }
                  navigator.clipboard.writeText(currentTabCodeEl.value);
                  showToast(t("code_copied"), "success");
                }}>
                {t("copy_code")}
              </Button>
            </DialogFooter>
          </>
        </div>
      </div>
    </DialogContent>
  );
};

export const EmbedDialog = ({
  types,
  tabs,
  eventTypeHideOptionDisabled,
}: {
  types: EmbedTypes;
  tabs: EmbedTabs;
  eventTypeHideOptionDisabled: boolean;
}) => {
  const searchParams = useCompatSearchParams();
  const embedUrl = (searchParams?.get("embedUrl") || "") as string;
  const namespace = (searchParams?.get("namespace") || "") as string;
  return (
    <Dialog name="embed" clearQueryParamsOnClose={queryParamsForDialog}>
      {!searchParams?.get("embedType") ? (
        <ChooseEmbedTypesDialogContent types={types} />
      ) : (
        <EmbedTypeCodeAndPreviewDialogContent
          embedType={searchParams?.get("embedType") as EmbedType}
          embedUrl={embedUrl}
          namespace={namespace}
          tabs={tabs}
          types={types}
          eventTypeHideOptionDisabled={eventTypeHideOptionDisabled}
        />
      )}
    </Dialog>
  );
};

type EmbedButtonProps<T> = {
  embedUrl: string;
  namespace: string;
  children?: React.ReactNode;
  className?: string;
  as?: T;
  eventId?: number;
};

export const EmbedButton = <T extends React.ElementType = typeof Button>({
  embedUrl,
  children,
  className = "",
  as,
  eventId,
  namespace,
  ...props
}: EmbedButtonProps<T> & React.ComponentPropsWithoutRef<T>) => {
  const { goto } = useRouterHelpers();
  className = classNames("hidden lg:inline-flex", className);

  const openEmbedModal = () => {
    goto({
      dialog: "embed",
      eventId: eventId ? eventId.toString() : "",
      namespace,
      embedUrl,
    });
  };
  const Component = as ?? Button;

  return (
    <Component
      {...props}
      className={className}
      data-test-embed-url={embedUrl}
      data-testid="embed"
      type="button"
      onClick={() => {
        openEmbedModal();
      }}>
      {children}
    </Component>
  );
};
