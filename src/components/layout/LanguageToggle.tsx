import { Button } from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu.tsx";
import { Check } from "lucide-react";
import { useI18n } from "@/shared/hooks/useI18n.ts";
import type { Locale } from "@/shared/i18n/messages.ts";
import { getLocaleDisplayName, getLocaleFlag, getTextDirection } from "@/shared/i18n/utils.ts";

const LANGS: { code: Locale; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "fa", label: "FA" },
    { code: "ar", label: "AR" },
    { code: "zh-CN", label: "ZH" },
    { code: "hi", label: "HI" },
    { code: "es", label: "ES" },
    { code: "fr", label: "FR" },
    { code: "bn", label: "BN" },
    { code: "pt", label: "PT" },
    { code: "ru", label: "RU" },
    { code: "ur", label: "UR" },
    { code: "id", label: "ID" },
    { code: "de", label: "DE" },
    { code: "ja", label: "JA" },
    { code: "sw", label: "SW" },
    { code: "te", label: "TE" },
    { code: "tr", label: "TR" },
];

export default function LanguageToggle() {
    const { locale, setLocale, t } = useI18n();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="font-medium">
                    {getLocaleFlag(locale)} {locale.toUpperCase()}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="min-w-44"
                style={{ direction: getTextDirection(locale) }}
            >
                <DropdownMenuLabel>{t("changeLanguage")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {LANGS.map((l) => (
                    <DropdownMenuItem
                        key={l.code}
                        onSelect={() => setLocale(l.code)}
                        className="flex items-center justify-between"
                    >
                        <span className="flex items-center gap-2">
                            <span className="w-9 inline-block text-muted-foreground">
                                {getLocaleFlag(l.code)} {l.label}
                            </span>
                            <span>{getLocaleDisplayName(l.code)}</span>
                        </span>
                        {locale === l.code ? <Check className="w-4 h-4" /> : null}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}