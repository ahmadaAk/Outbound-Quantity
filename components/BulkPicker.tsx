import React, { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { CalculatorIcon, TrashIcon, ClipboardCopyIcon, CheckCircleIcon, ArrowRightIcon, ArrowLeftIcon } from './icons.tsx';

const BulkPicker: React.FC = () => {
    const [available, setAvailable] = useState('');
    const [target, setTarget] = useState('');
    const [result, setResult] = useState<(number | string)[]>([]);
    const [error, setError] = useState<string>('');
    const [isCopied, setIsCopied] = useState(false);
    const resultsRef = useRef<HTMLDivElement>(null);
    const { t, dir, language } = useLanguage();

    const handleReset = () => {
        setAvailable('');
        setTarget('');
        setResult([]);
        setError('');
        setIsCopied(false);
    };

    const copyToClipboard = () => {
        if (result.length > 0) {
            navigator.clipboard.writeText(result.join('\n')).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            });
        }
    };

    const calculatePickingList = () => {
        setError('');
        setResult([]);
        setIsCopied(false);

        const targetQuantity = Number(target);

        // 1. Validate target quantity
        if (isNaN(targetQuantity) || targetQuantity <= 0) {
            setError(t('error_invalid_target'));
            return;
        }

        // 2. Parse input lines, preserving original line index for each valid number
        const originalLines = available.split(/\r?\n/);
        const availableQuantities = originalLines
            .map((line, index) => ({
                value: Number(line.trim()),
                originalIndex: index,
            }))
            .filter(item => !isNaN(item.value) && item.value > 0);

        // 3. Validate available quantities
        if (availableQuantities.length === 0) {
            setError(t('error_no_quantities'));
            return;
        }

        const totalAvailable = availableQuantities.reduce((sum, item) => sum + item.value, 0);
        if (totalAvailable < targetQuantity) {
            setError(t('error_insufficient', totalAvailable, targetQuantity));
            return;
        }

        // 4. Perform greedy pick on a sorted copy (picking smallest first is optimal)
        const sortedQuantities = [...availableQuantities].sort((a, b) => a.value - b.value);

        const pickedItems: { value: number; originalIndex: number }[] = [];
        let currentSum = 0;

        for (const item of sortedQuantities) {
            if (currentSum === targetQuantity) break;

            const needed = targetQuantity - currentSum;

            if (item.value <= needed) {
                pickedItems.push({ value: item.value, originalIndex: item.originalIndex });
                currentSum += item.value;
            } else {
                pickedItems.push({ value: needed, originalIndex: item.originalIndex });
                currentSum += needed;
            }
        }

        // 5. Construct final result array, mapping picked values back to their original line positions
        const finalResult: (number | string)[] = Array(originalLines.length).fill('');
        
        for (const pickedItem of pickedItems) {
            finalResult[pickedItem.originalIndex] = pickedItem.value;
        }
        
        setResult(finalResult);

        // Scroll to results
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    const totalPicked = result.reduce((sum, qty) => sum + (typeof qty === 'number' ? qty : 0), 0);

    return (
        <div className="p-4 md:p-2">
            <div className="max-w-7xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-700 p-6 md:p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2 text-slate-100">{t('toolTitle')}</h2>
                    <p className="text-slate-400 max-w-3xl mx-auto">{t('toolDescription')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-start">
                    {/* Input Panel */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <label htmlFor="available" className="block mb-2 font-medium text-slate-300">
                                {t('pasteLabel')}
                            </label>
                            <textarea
                                id="available"
                                value={available}
                                onChange={(e) => setAvailable(e.target.value)}
                                className="bg-slate-900 border border-slate-600 text-slate-200 text-lg rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-4 h-48 resize-y"
                                placeholder={t('pastePlaceholder')}
                                dir="ltr"
                            />
                        </div>
                        <div>
                            <label htmlFor="target" className="block mb-2 font-medium text-slate-300">
                               {t('targetLabel')}
                            </label>
                             <input
                                type="number"
                                id="target"
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                className="bg-slate-900 border border-slate-600 text-slate-200 text-lg rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-4"
                                placeholder={t('targetPlaceholder')}
                                dir="ltr"
                            />
                        </div>
                        {error && <p className="text-center text-red-400 bg-red-900/50 p-3 rounded-lg border border-red-700">{error}</p>}
                        <div className="flex items-center gap-4 mt-2">
                             <button
                                onClick={calculatePickingList}
                                className="w-full flex items-center justify-center gap-3 bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-cyan-500/30 hover:bg-cyan-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!available || !target}
                             >
                                <CalculatorIcon className="h-6 w-6" />
                                <span>{t('calculateButton')}</span>
                            </button>
                            <button onClick={handleReset} className="p-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors" title={t('clearButtonTitle')}>
                                <TrashIcon />
                            </button>
                        </div>
                    </div>
                    
                    {/* Visual Separator */}
                    <div className="hidden md:flex items-center justify-center h-full">
                        <div className="bg-slate-700/50 p-3 rounded-full shadow-lg border border-slate-600">
                            {dir === 'rtl' ? <ArrowLeftIcon className="h-8 w-8 text-cyan-400" /> : <ArrowRightIcon className="h-8 w-8 text-cyan-400" />}
                        </div>
                    </div>

                    {/* Results Panel */}
                    <div ref={resultsRef} className="bg-slate-900/70 rounded-lg border border-slate-700 p-6 flex flex-col min-h-[420px]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-cyan-400">{t('resultsTitle')}</h3>
                            {result.length > 0 && (
                                <div className="relative group flex items-center">
                                    <button onClick={copyToClipboard} className="p-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors" aria-label={t('copyButtonTitle')}>
                                        {isCopied ? <CheckCircleIcon className="h-5 w-5 text-green-400" /> : <ClipboardCopyIcon className="h-5 w-5" />}
                                    </button>
                                    <div className="absolute bottom-full ltr:right-0 rtl:left-0 mb-2 hidden group-hover:block whitespace-nowrap bg-slate-600 text-white text-xs rounded py-1 px-2 pointer-events-none">
                                        {isCopied ? t('copiedButton') : t('copyButtonTitle')}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex-grow flex flex-col">
                           <textarea
                                readOnly
                                value={result.length > 0 ? result.join('\n') : ''}
                                className="bg-slate-800 border border-slate-600 text-slate-200 text-lg rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-4 flex-grow resize-y"
                                placeholder={t('resultsPlaceholder')}
                                dir="ltr"
                            />
                            {result.length > 0 && totalPicked > 0 && (
                                <div className="mt-4 pt-4 border-t border-slate-700">
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="font-medium text-slate-300">{t('totalPicked')}</span>
                                        <span className="font-bold text-cyan-300">{totalPicked.toLocaleString(language)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BulkPicker;