// Обобщённый интерфейс стора, который можно использовать для любого типа сущности (например, Account, Campaign и т.д.)
export interface BaseStore<T> {
  items: T[]; // Все элементы (например, все аккаунты, кампании и т.д.)
  selectedItems: string[]; // ID или уникальные ключи выбранных элементов
  searchQuery: string; // Текущая строка поиска
  sortKey: string; // Поле, по которому происходит сортировка
  sortOrder: 'asc' | 'desc'; // Направление сортировки: по возрастанию или убыванию
  isLoading: boolean; // Флаг загрузки (например, во время запроса к API)

  // Устанавливает новый список элементов
  setItems: (items: T[]) => void;

  // Обновляет один элемент по имени (или ID, если нужно адаптировать)
  updateItem: (name: string, item: T) => void;

  // Добавляет новый элемент
  addItem: (item: T) => void;

  // Переключает выбор одного элемента (добавляет или убирает из selectedItems)
  toggleItemSelection: (id: string) => void;

  // Выбирает или снимает выбор со всех элементов
  toggleAllSelection: () => void;

  // Убирает все элементы из selectedItems
  unselectAll: () => void;

  // Устанавливает строку поиска
  setSearchQuery: (query: string) => void;

  // Устанавливает ключ сортировки
  setSortKey: (key: string) => void;

  // Удаляет все выбранные элементы
  deleteSelectedItems: () => void;

  // Сброс стора в исходное состояние
  reset: () => void;
}

// Интерфейс для рекламного аккаунта
export interface Account {
  username: string; // Логин или идентификатор аккаунта
  status: string; // Статус (например, active / paused / disabled)
  metrics: MetricsType[]; // Метрики аккаунта (показы, клики и т.д.)
}

// Интерфейс для рекламной кампании
export interface Campaing {
  name: string; // Название кампании
  status: string; // Статус кампании
  metrics?: MetricsType[]; // Опциональные метрики кампании
  createdBy: string[]; // Кто создал кампанию (может быть список пользователей или ID)
}

// Интерфейс для группы объявлений
export interface Group {
  name: string; // Название группы
  status: string; // Статус группы
  metrics?: MetricsType[]; // Опциональные метрики
  campaigns: string[]; // Список ID или названий кампаний, к которым относится группа
}

// Интерфейс для отдельного рекламного объявления
export interface Ad {
  name: string; // Название объявления
  status: string; // Статус объявления
  metrics?: MetricsType[]; // Опциональные метрики
  groups: string[]; // Список ID или названий групп, к которым относится объявление
}

// Метрики для всех сущностей (можно использовать и для аккаунтов, и для кампаний, и для объявлений)
export interface MetricsType {
  impressions?: string; // Количество показов
  spend?: string; // Потраченные средства
  clicks?: string; // Количество кликов
  ecpm?: string; // Эффективная цена за тысячу показов
  cpc?: string; // Цена за клик
  ctr?: string; // Click-Through Rate — кликабельность
}
