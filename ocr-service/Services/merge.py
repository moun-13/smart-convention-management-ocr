def merge_results(regex_result, llm_result):

    final = regex_result.copy()

    for key in final:

        if (
            final[key] == ""
            or final[key] == []
            or final[key] is None
        ):
            final[key] = llm_result.get(key, final[key])

        # Nettoyage OCR final pour les hallucinations connues (caractères hindi/persans)
        if isinstance(final[key], str):
            final[key] = final[key].replace('िकी', 'يكي').replace('کی', 'كي').replace('ی', 'ي')

    return final

IMPORTANT_FIELDS = [
    "موضوع_الاتفاقية",
    "الشريك",
    "صاحب_المشروع",
    "تاريخ_البداية",
    "رقم_الاتفاقية"
]


def needs_llm(result):

    for field in IMPORTANT_FIELDS:

        value = result.get(field)

        if value is None:
            return True

        if value == "":
            return True

        if value == []:
            return True

    return False