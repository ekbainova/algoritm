export function friendlyError(error: string): string {
  if (error.includes('SyntaxError'))
    return 'Ошибка в синтаксисе — проверь скобки, кавычки и двоеточия';
  if (error.includes('NameError'))
    return 'Переменная не найдена — возможно, ты её ещё не создал';
  if (error.includes('IndentationError'))
    return 'Ошибка отступов — проверь, что код внутри блоков сдвинут на 4 пробела';
  if (error.includes('TypeError'))
    return 'Несовпадение типов — например, нельзя складывать число и текст напрямую';
  if (error.includes('ZeroDivisionError'))
    return 'Деление на ноль — на ноль делить нельзя!';
  if (error.includes('IndexError'))
    return 'Индекс за пределами списка — элемента с таким номером нет';
  return error;
}
