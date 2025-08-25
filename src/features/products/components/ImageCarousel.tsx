export function ImageCarousel({ images, altBase }: { images?: string[]; altBase: string }) {
    const list = images?.length ? images : [""];
    return (
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            {list.map((img, idx) => (
                <div key={`${img}-${idx}`} className="w-full flex-shrink-0 snap-center">
                    <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted/20 rounded-md">
                        {img ? (
                            <img
                                src={img}
                                alt={`${altBase} - ${idx + 1}`}
                                className="absolute inset-0 h-full w-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                                No image
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
