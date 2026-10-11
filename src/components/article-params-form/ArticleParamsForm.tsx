import {
  backgroundColors,
  contentWidthArr,
  defaultArticleState,
  fontColors,
  fontFamilyOptions,
  fontSizeOptions,
} from '@/constants/articleProps.ts';
import { clsx } from 'clsx';
import { useRef, useState } from 'react';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

import { useClose } from '@hooks/useClose';

import type { ArticleStateType, OptionType } from '@/constants/articleProps.ts';
import type { FormEvent } from 'react';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
  articleState: ArticleStateType;
  setArticleState: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
  articleState,
  setArticleState,
}: ArticleParamsFormProps): React.JSX.Element => {
  // Состояние открытия сайдбара с настройками статьи
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Состояние формы — черновик, на страницу не влияет до «Применить»
  const [formState, setFormState] = useState<ArticleStateType>(articleState);
  // Ключ для принудительного пересоздания RadioGroup после «Сбросить»,
  // иначе повторный выбор того же размера шрифта не срабатывает
  const [radioGroupKey, setRadioGroupKey] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  // Закрытие сайдбара по клику вне его и по нажатию Esc
  useClose({
    containerRef: rootRef,
    isOpen: isSidebarOpen,
    setIsOpen: setIsSidebarOpen,
  });

  const handleChange =
    (field: keyof ArticleStateType) =>
    (value: OptionType): void => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setArticleState(formState);
  };

  const handleReset = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setFormState(defaultArticleState);
    setArticleState(defaultArticleState);
    setRadioGroupKey((prev) => prev + 1);
  };

  return (
    <div ref={rootRef}>
      <ArrowButton
        isOpen={isSidebarOpen}
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      />
      <aside
        className={clsx(styles.container, {
          [styles.container_open]: isSidebarOpen,
        })}
      >
        <form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
          <Text as="h2" size={31} weight={800} uppercase>
            Задайте параметры
          </Text>

          <Select
            title="Шрифт"
            selected={formState.fontFamilyOption}
            options={fontFamilyOptions}
            onChange={handleChange('fontFamilyOption')}
          />

          <RadioGroup
            key={radioGroupKey}
            title="Размер шрифта"
            name="fontSize"
            selected={formState.fontSizeOption}
            options={fontSizeOptions}
            onChange={handleChange('fontSizeOption')}
          />

          <Select
            title="Цвет шрифта"
            selected={formState.fontColor}
            options={fontColors}
            onChange={handleChange('fontColor')}
          />

          <Separator />

          <Select
            title="Цвет фона"
            selected={formState.backgroundColor}
            options={backgroundColors}
            onChange={handleChange('backgroundColor')}
          />

          <Select
            title="Ширина контента"
            selected={formState.contentWidth}
            options={contentWidthArr}
            onChange={handleChange('contentWidth')}
          />

          <div className={styles.bottomContainer}>
            <Button title="Сбросить" htmlType="reset" type="clear" />
            <Button title="Применить" htmlType="submit" type="apply" />
          </div>
        </form>
      </aside>
    </div>
  );
};
